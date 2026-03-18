import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';

const guardPlugin: FastifyPluginAsync = async (fastify, options) => {
  fastify.decorate('requireRole', (roles: string[]) => {
    return async (request: any, reply: any) => {
      // Logic to verify user role
    };
  });

  fastify.decorate('requireFeature', (feature: string) => {
    return async (request: any, reply: any) => {
      // Logic to verify org feature
    };
  });

  fastify.decorate('requireOwnership', (resourceUserId: string) => {
    return async (request: any, reply: any) => {
      // Logic to verify ownership
    };
  });
};

export default fp(guardPlugin);
