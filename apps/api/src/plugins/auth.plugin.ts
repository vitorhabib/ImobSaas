import fp from 'fastify-plugin';
import { FastifyPluginAsync, FastifyRequest, FastifyReply } from 'fastify';

declare module 'fastify' {
  interface FastifyRequest {
    user?: any;
    organization?: any;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      // Logic to fetch user and organization based on x-org-slug header would go here
      // const orgSlug = request.headers['x-org-slug'];
      // Verify member is active
    } catch (err) {
      reply.send(err);
    }
  });
};

export default fp(authPlugin);
