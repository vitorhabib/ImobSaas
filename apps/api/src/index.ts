import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';
import { createClient } from '@supabase/supabase-js';
import { prisma } from '@imob-saas/db';

import authPlugin from './plugins/auth.plugin';
import guardPlugin from './plugins/guard.plugin';
import auditPlugin from './plugins/audit.plugin';

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
  return createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

// Auth Routes
fastify.post('/auth/login', async (request, reply) => {
  const { email, password } = request.body as { email: string; password: string };

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error || !data.user) {
    return reply.status(401).send({ error: 'Email ou senha inválidos' });
  }

  const user = await prisma.user.findUnique({
    where: { authId: data.user.id },
    include: {
      member: { include: { organization: true } },
    },
  });

  if (!user?.member) {
    return reply.status(401).send({ error: 'Usuário não encontrado' });
  }

  const token = fastify.jwt.sign({
    userId: user.id,
    orgId: user.member.organizationId,
    slug: user.member.organization.slug,
    role: user.member.role,
  });

  return reply.send({ token, slug: user.member.organization.slug });
});

fastify.post('/auth/magic-link', async (_request, _reply) => { return { message: 'magic-link' }; });
fastify.post('/auth/refresh', async (_request, _reply) => { return { message: 'refresh' }; });
fastify.post('/auth/logout', async (_request, _reply) => { return { message: 'logout' }; });
fastify.post('/auth/reset-password', async (_request, _reply) => { return { message: 'reset-password' }; });

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

  // Check slug availability
  const existingOrg = await prisma.organization.findUnique({ where: { slug: body.slug } });
  if (existingOrg) {
    return reply.status(400).send({ error: 'Esse slug já está em uso' });
  }

  const supabase = getSupabaseAdmin();

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
  let plan = await prisma.plan.findFirst({ where: { name: 'Trial', isActive: true } });
  if (!plan) {
    plan = await prisma.plan.create({
      data: {
        name: 'Trial',
        maxUsers: 3,
        maxListings: 10,
        features: ['basic'],
        price: 0,
        isActive: true,
      },
    });
  }

  // Create org, user and member in a transaction
  const result = await prisma.$transaction(async (tx) => {
    const org = await tx.organization.create({
      data: {
        slug: body.slug,
        name: body.name,
        personType: body.personType,
        email: body.email,
        phone: body.phone ?? null,
        cpf: body.cpf ?? null,
        cnpj: body.cnpj ?? null,
        planId: plan!.id,
      },
    });

    const user = await tx.user.create({
      data: {
        authId: authData.user.id,
        email: body.ownerEmail,
        name: body.ownerName,
      },
    });

    const member = await tx.member.create({
      data: {
        userId: user.id,
        organizationId: org.id,
        role: 'OWNER',
      },
    });

    return { org, user, member };
  });

  const token = fastify.jwt.sign({
    userId: result.user.id,
    orgId: result.org.id,
    slug: result.org.slug,
    role: 'OWNER',
  });

  return reply.status(201).send({ token, slug: result.org.slug });
});

fastify.get('/organizations/:slug', async (_request, _reply) => { return { message: 'get org' }; });
fastify.put('/organizations/:slug', async (_request, _reply) => { return { message: 'update org' }; });
fastify.get('/organizations/:slug/usage', async (_request, _reply) => { return { message: 'org usage' }; });
fastify.get('/organizations/slug/check/:slug', async (request, _reply) => {
  const { slug } = request.params as { slug: string };
  const org = await prisma.organization.findUnique({ where: { slug } });
  return { available: !org };
});

fastify.get('/organizations/:slug/members', async (_request, _reply) => { return { message: 'list members' }; });
fastify.post('/organizations/:slug/members/invite', async (_request, _reply) => { return { message: 'invite member' }; });
fastify.patch('/organizations/:slug/members/:id', async (_request, _reply) => { return { message: 'edit member' }; });
fastify.delete('/organizations/:slug/members/:id', async (_request, _reply) => { return { message: 'remove member' }; });

fastify.get('/plans', async (_request, _reply) => {
  const plans = await prisma.plan.findMany({ where: { isActive: true } });
  return plans;
});

fastify.post('/billing/subscribe', async (_request, _reply) => { return { message: 'subscribe' }; });
fastify.post('/billing/cancel', async (_request, _reply) => { return { message: 'cancel' }; });
fastify.get('/billing/invoices', async (_request, _reply) => { return { message: 'invoices' }; });

fastify.post('/webhooks/stripe', async (_request, _reply) => { return { message: 'stripe webhook' }; });
fastify.post('/webhooks/abacatepay', async (_request, _reply) => { return { message: 'abacatepay webhook' }; });

fastify.get('/notifications', async (_request, _reply) => { return { message: 'list notifications' }; });
fastify.patch('/notifications/:id/read', async (_request, _reply) => { return { message: 'read notification' }; });
fastify.patch('/notifications/read-all', async (_request, _reply) => { return { message: 'read all' }; });

// Admin Routes
fastify.get('/admin/organizations', async (_request, _reply) => { return { message: 'admin get orgs' }; });
fastify.patch('/admin/organizations/:id/status', async (_request, _reply) => { return { message: 'admin edit org status' }; });
fastify.post('/admin/organizations/:id/impersonate', async (_request, _reply) => { return { message: 'admin impersonate' }; });
fastify.get('/admin/metrics', async (_request, _reply) => { return { message: 'admin metrics' }; });
fastify.get('/admin/audit', async (_request, _reply) => { return { message: 'admin audit' }; });
fastify.get('/admin/tickets', async (_request, _reply) => { return { message: 'admin tickets' }; });

const start = async () => {
  try {
    await fastify.listen({ port: 3001, host: '0.0.0.0' });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
