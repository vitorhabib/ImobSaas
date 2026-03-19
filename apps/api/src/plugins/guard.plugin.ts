import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const guardPlugin: FastifyPluginAsync = async (fastify, _options) => {
  fastify.decorate('requireRole', (_roles: string[]) => {
    return async (_request: any, _reply: any) => {
      // Logic to verify user role
    };
  });

  fastify.decorate('requireFeature', (_feature: string) => {
    return async (_request: any, _reply: any) => {
      // Logic to verify org feature
    };
  });

  fastify.decorate('requireOwnership', (_resourceUserId: string) => {
    return async (_request: any, _reply: any) => {
      // Logic to verify ownership
    };
  });
};

export default fp(guardPlugin);
