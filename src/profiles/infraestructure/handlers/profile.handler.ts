import ProfileService from '@/profiles/application/profile.service.js';
import PostgresRepository from '@/profiles/infraestructure/persistance/repositories/postgres.repository.js';
import type { FastifyReply, FastifyRequest } from 'fastify';

const profileService = new ProfileService(new PostgresRepository());

async function getOwnUserInformation(request: FastifyRequest) {
  const userUuid = request.session.user.uuid;
  return await profileService.getProfileByUuid(userUuid);
}

async function createProfile(
  request: FastifyRequest<{
    Body: {
      name: string;
    };
  }>,
  reply: FastifyReply
) {
  const name = request.body.name;
  const userUuid = request.session.user.uuid;
  const username = request.session.user.username;

  try {
    return await profileService.createProfile({
      name,
      username,
      uuid: userUuid,
    });
  } catch (err) {
    reply.status(400);
    return { message: err.message };
  }
}

async function getAllProfiles() {
  return await profileService.getAllProfiles();
}

export { createProfile, getAllProfiles, getOwnUserInformation };
