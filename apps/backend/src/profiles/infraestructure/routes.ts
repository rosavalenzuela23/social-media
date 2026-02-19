import type { FastifyInstance } from 'fastify';
import {
  getAllProfiles,
  getOwnUserInformation,
  createProfile,
} from '@/profiles/infraestructure/handlers/profile.handler.js';
import { requireAuth } from '@shared/infrastructure/fastify/auth-hook.js';
import createProfileSchema from './schemas/create-profile.schema.js';

async function routes(fastify: FastifyInstance) {
  const defaultRoute = '/api/profiles';
  const adminRoute = '/api/admin/profiles';
  fastify.post(
    defaultRoute + '/me',
    { schema: { body: createProfileSchema } },
    createProfile
  );
  fastify.get(
    defaultRoute + '/me',
    { preHandler: [requireAuth] },
    getOwnUserInformation
  );
  fastify.get(adminRoute + '/', { preHandler: [requireAuth] }, getAllProfiles);
}

export default routes;
