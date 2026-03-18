import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const auditPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.addHook('onResponse', async (request: any, reply: any) => {
    const { method } = request;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      // Logic to automatically record AuditLog
      // Capture before and after of the resource
      // Register IP, userId, organizationId, impersonatedBy if present
    }
  });
};

export default fp(auditPlugin);
