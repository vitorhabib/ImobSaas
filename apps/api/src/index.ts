import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

import authPlugin from './plugins/auth.plugin';
import guardPlugin from './plugins/guard.plugin';
import auditPlugin from './plugins/audit.plugin';

dotenv.config({ path: resolve(__dirname, '../.env') });

const fastify = Fastify({ logger: true });

fastify.register(cors, { origin: true });
fastify.register(helmet);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key',
});

fastify.register(authPlugin);
fastify.register(guardPlugin);
fastify.register(auditPlugin);

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
    throw new Error('As variáveis SUPABASE_URL e SUPABASE_SERVICE_KEY são obrigatórias');
  }
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Auth Routes
fastify.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return reply.status(401).send({ error: 'Email ou senha inválidos' });
  }

  // Busca o usuário no Supabase
  const { data: user, error: userError } = await supabase
    .from('users')
    .select(
      `
      id,
      auth_id,
      members!inner(
        role,
        organization_id,
        organizations!inner(
          slug
        )
      )
    `,
    )
    .eq('auth_id', data.user.id)
    .single();

  if (userError || !user || !user.members || user.members.length === 0) {
    return reply.status(401).send({ error: 'Usuário não encontrado ou sem organização' });
  }

  const member = user.members[0] as any;
  const org = member.organizations as any;

  const token = fastify.jwt.sign({
    userId: user.id,
    orgId: member.organization_id,
    slug: org.slug,
    role: member.role,
  });

  return reply.send({ token, slug: org.slug });
});

fastify.post('/auth/magic-link', async (_request, _reply) => {
  return { message: 'magic-link' };
});
fastify.post('/auth/refresh', async (_request, _reply) => {
  return { message: 'refresh' };
});
fastify.post('/auth/logout', async (_request, _reply) => {
  return { message: 'logout' };
});
fastify.post('/auth/reset-password', async (_request, _reply) => {
  return { message: 'reset-password' };
});

// Organization Routes
fastify.post('/organizations', async (request, reply) => {
  const body = request.body as {
    personType: 'INDIVIDUAL' | 'COMPANY';
    name: string;
    slug: string;
    email: string;
    phone?: string;
    cpf?: string;
    cnpj?: string;
    ownerName: string;
    ownerEmail: string;
    ownerPassword: string;
  };

  const supabase = getSupabaseAdmin();

  // Check slug availability
  const { data: existingOrg } = await supabase
    .from('organizations')
    .select('id')
    .eq('slug', body.slug)
    .single();

  if (existingOrg) {
    return reply.status(400).send({ error: 'Esse slug já está em uso' });
  }

  // Create Supabase auth user
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: body.ownerEmail,
    password: body.ownerPassword,
    email_confirm: true,
  });

  if (authError || !authData.user) {
    return reply.status(400).send({ error: authError?.message || 'Erro ao criar usuário' });
  }

  // Find or create default trial plan
  let { data: plan } = await supabase
    .from('plans')
    .select('id')
    .eq('name', 'Trial')
    .eq('is_active', true)
    .single();

  if (!plan) {
    const { data: newPlan, error: planError } = await supabase
      .from('plans')
      .insert({
        name: 'Trial',
        max_users: 3,
        max_listings: 10,
        features: ['basic'],
        price: 0,
        is_active: true,
      })
      .select('id')
      .single();

    if (planError || !newPlan) {
      return reply.status(500).send({ error: 'Erro ao criar plano Trial' });
    }
    plan = newPlan;
  }

  // Create org, user and member
  const { data: org, error: orgError } = await supabase
    .from('organizations')
    .insert({
      slug: body.slug,
      name: body.name,
      person_type: body.personType,
      email: body.email,
      phone: body.phone ?? null,
      cpf: body.cpf ?? null,
      cnpj: body.cnpj ?? null,
      plan_id: plan.id,
    })
    .select('id, slug')
    .single();

  if (orgError || !org) {
    return reply.status(500).send({ error: 'Erro ao criar organização' });
  }

  const { data: user, error: userCreateError } = await supabase
    .from('users')
    .insert({
      auth_id: authData.user.id,
      email: body.ownerEmail,
      name: body.ownerName,
    })
    .select('id')
    .single();

  if (userCreateError || !user) {
    return reply.status(500).send({ error: 'Erro ao criar perfil de usuário' });
  }

  const { data: member, error: memberError } = await supabase
    .from('members')
    .insert({
      user_id: user.id,
      organization_id: org.id,
      role: 'OWNER',
    })
    .select('id')
    .single();

  if (memberError || !member) {
    return reply.status(500).send({ error: 'Erro ao associar usuário à organização' });
  }

  const token = fastify.jwt.sign({
    userId: user.id,
    orgId: org.id,
    slug: org.slug,
    role: 'OWNER',
  });

  return reply.status(201).send({ token, slug: org.slug });
});

fastify.get('/organizations/:slug', async (_request, _reply) => {
  return { message: 'get org' };
});
fastify.put('/organizations/:slug', async (_request, _reply) => {
  return { message: 'update org' };
});
fastify.get('/organizations/:slug/usage', async (_request, _reply) => {
  return { message: 'org usage' };
});
fastify.get('/organizations/slug/check/:slug', async (request, _reply) => {
  const { slug } = request.params as { slug: string };
  const supabase = getSupabaseAdmin();
  const { data: org } = await supabase.from('organizations').select('id').eq('slug', slug).single();
  return { available: !org };
});

fastify.get('/organizations/:slug/members', async (_request, _reply) => {
  return { message: 'list members' };
});
fastify.post('/organizations/:slug/members/invite', async (_request, _reply) => {
  return { message: 'invite member' };
});
fastify.patch('/organizations/:slug/members/:id', async (_request, _reply) => {
  return { message: 'edit member' };
});
fastify.delete('/organizations/:slug/members/:id', async (_request, _reply) => {
  return { message: 'remove member' };
});

fastify.get('/plans', async (_request, _reply) => {
  const supabase = getSupabaseAdmin();
  const { data: plans } = await supabase.from('plans').select('*').eq('is_active', true);
  return plans;
});

fastify.post('/billing/subscribe', async (_request, _reply) => {
  return { message: 'subscribe' };
});
fastify.post('/billing/cancel', async (_request, _reply) => {
  return { message: 'cancel' };
});
fastify.get('/billing/invoices', async (_request, _reply) => {
  return { message: 'invoices' };
});

fastify.post('/webhooks/stripe', async (_request, _reply) => {
  return { message: 'stripe webhook' };
});
fastify.post('/webhooks/abacatepay', async (_request, _reply) => {
  return { message: 'abacatepay webhook' };
});

fastify.get('/notifications', async (_request, _reply) => {
  return { message: 'list notifications' };
});
fastify.patch('/notifications/:id/read', async (_request, _reply) => {
  return { message: 'read notification' };
});
fastify.patch('/notifications/read-all', async (_request, _reply) => {
  return { message: 'read all' };
});

// Admin Routes
fastify.get('/admin/organizations', async (_request, _reply) => {
  return { message: 'admin get orgs' };
});
fastify.patch('/admin/organizations/:id/status', async (_request, _reply) => {
  return { message: 'admin edit org status' };
});
fastify.post('/admin/organizations/:id/impersonate', async (_request, _reply) => {
  return { message: 'admin impersonate' };
});
fastify.get('/admin/metrics', async (_request, _reply) => {
  return { message: 'admin metrics' };
});
fastify.get('/admin/audit', async (_request, _reply) => {
  return { message: 'admin audit' };
});
fastify.get('/admin/tickets', async (_request, _reply) => {
  return { message: 'admin tickets' };
});

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
