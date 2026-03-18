import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import jwt from '@fastify/jwt';

import authPlugin from './plugins/auth.plugin';
import guardPlugin from './plugins/guard.plugin';
import auditPlugin from './plugins/audit.plugin';

const fastify = Fastify({
  logger: true,
});

fastify.register(cors);
fastify.register(helmet);
fastify.register(jwt, {
  secret: process.env.JWT_SECRET || 'super-secret-key',
});

fastify.register(authPlugin);
fastify.register(guardPlugin);
fastify.register(auditPlugin);

// Core Routes
fastify.register(async (app) => {
  app.post('/auth/login', async (request, reply) => { return { message: 'login' }; });
  app.post('/auth/magic-link', async (request, reply) => { return { message: 'magic-link' }; });
  app.post('/auth/refresh', async (request, reply) => { return { message: 'refresh' }; });
  app.post('/auth/logout', async (request, reply) => { return { message: 'logout' }; });
  app.post('/auth/reset-password', async (request, reply) => { return { message: 'reset-password' }; });

  app.post('/organizations', async (request, reply) => { return { message: 'create org' }; });
  app.get('/organizations/:slug', async (request, reply) => { return { message: 'get org' }; });
  app.put('/organizations/:slug', async (request, reply) => { return { message: 'update org' }; });
  app.get('/organizations/:slug/usage', async (request, reply) => { return { message: 'org usage' }; });
  app.get('/organizations/slug/check/:slug', async (request, reply) => { return { message: 'check slug' }; });

  app.get('/organizations/:slug/members', async (request, reply) => { return { message: 'list members' }; });
  app.post('/organizations/:slug/members/invite', async (request, reply) => { return { message: 'invite member' }; });
  app.patch('/organizations/:slug/members/:id', async (request, reply) => { return { message: 'edit member' }; });
  app.delete('/organizations/:slug/members/:id', async (request, reply) => { return { message: 'remove member' }; });

  app.get('/plans', async (request, reply) => { return { message: 'list plans' }; });
  app.post('/billing/subscribe', async (request, reply) => { return { message: 'subscribe' }; });
  app.post('/billing/cancel', async (request, reply) => { return { message: 'cancel' }; });
  app.get('/billing/invoices', async (request, reply) => { return { message: 'invoices' }; });
  
  app.post('/webhooks/stripe', async (request, reply) => { return { message: 'stripe webhook' }; });
  app.post('/webhooks/abacatepay', async (request, reply) => { return { message: 'abacatepay webhook' }; });

  app.get('/notifications', async (request, reply) => { return { message: 'list notifications' }; });
  app.patch('/notifications/:id/read', async (request, reply) => { return { message: 'read notification' }; });
  app.patch('/notifications/read-all', async (request, reply) => { return { message: 'read all' }; });
});

// Admin Routes
fastify.register(async (app) => {
  app.get('/admin/organizations', async (request, reply) => { return { message: 'admin get orgs' }; });
  app.patch('/admin/organizations/:id/status', async (request, reply) => { return { message: 'admin edit org status' }; });
  app.post('/admin/organizations/:id/impersonate', async (request, reply) => { return { message: 'admin impersonate' }; });
  app.get('/admin/metrics', async (request, reply) => { return { message: 'admin metrics' }; });
  app.get('/admin/audit', async (request, reply) => { return { message: 'admin audit' }; });
  app.get('/admin/tickets', async (request, reply) => { return { message: 'admin tickets' }; });
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
