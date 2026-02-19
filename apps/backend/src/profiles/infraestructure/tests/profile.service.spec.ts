import {
  appDataSource,
  initDb,
} from '@/profiles/infraestructure/persistance/postgres-connection.js';
import ProfileService from '@profiles/application/profile.service.js';
import PostgresRepository from '@profiles/infraestructure/persistance/repositories/postgres.repository.js';
import type { QueryRunner } from 'typeorm';
import { afterEach, beforeEach, expect, test } from 'vitest';

let repository: PostgresRepository;
let profileService: ProfileService;

let queryRunner: QueryRunner;

beforeEach(async () => {
  await initDb();
  queryRunner = appDataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();
  repository = new PostgresRepository(queryRunner.manager);
  profileService = new ProfileService(repository);
});

afterEach(async () => {
  await queryRunner.rollbackTransaction();
  await queryRunner.release();
  await appDataSource.destroy();
});

test('Create profile', async () => {
  const profile = await profileService.createProfile({
    uuid: 'uuid',
    username: 'username',
    name: 'name',
  });

  expect(profile).toEqual({
    uuid: 'uuid',
    username: 'username',
    friendProfileList: [],
    blockProfilesList: [],
  });
});

test('Not being able to store two profiles', async () => {
  await profileService.createProfile({
    uuid: 'uuid',
    username: 'username',
    name: 'name',
  });

  let error = null;
  try {
    await profileService.createProfile({
      uuid: 'uuid',
      username: 'username',
      name: 'name',
    });
  } catch (err) {
    error = err;
  }

  expect(error).toBeInstanceOf(Error);
  expect(error.message).toBe('profile already exists');
});
