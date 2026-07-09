import 'reflect-metadata';
import 'dotenv/config';
import { appDataSource as mongoDataSource, initDb as initMongo } from './shared/infrastructure/persistance/mongo-connection.js';
import { appDataSource as postgresDataSource, initDb as initPostgres } from './profiles/infraestructure/persistance/postgres-connection.js';
import UserEntity from './auth/infraestructure/persistance/entities/user.entity.js';
import ProfileEntity from './profiles/infraestructure/persistance/entities/profile.entity.js';
import PostEntity from './posts/infrastructure/persistance/entities/post.entity.js';
import bcrypt from 'bcrypt';
import { seedPosts } from './posts.seed.js';


async function seed() {
  try {
    console.log('Connecting to databases...');
    await initMongo();
    console.log('Connected to MongoDB.');
    await initPostgres();
    console.log('Connected to PostgreSQL.');

    console.log('Clearing old database records...');
    await mongoDataSource.getRepository(PostEntity).clear();
    await mongoDataSource.getRepository(UserEntity).clear();
    await postgresDataSource.getRepository(ProfileEntity).clear();
    console.log('Old records cleared.');

    console.log('Hashing passwords...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    console.log('Seeding users and profiles...');
    const seedUsers = [
      { name: 'John Doe', username: 'johndoe' },
      { name: 'Jane Smith', username: 'janesmith' },
      { name: 'Alice Johnson', username: 'alicej' },
      { name: 'Bob Brown', username: 'bobb' },
      { name: 'Charlie Green', username: 'charlieg' },
    ];

    const profilesMap = new Map<string, ProfileEntity>();

    for (const seed of seedUsers) {
      const user = new UserEntity();
      user.name = seed.name;
      user.username = seed.username;
      user.password = hashedPassword;

      const savedUser = await mongoDataSource.getRepository(UserEntity).save(user);

      const profile = new ProfileEntity();
      profile.uuid = savedUser.uuid;
      profile.name = seed.name;
      profile.username = seed.username;
      profile.uuidFriendList = [];
      profile.uuidBlockList = [];

      const savedProfile = await postgresDataSource.getRepository(ProfileEntity).save(profile);
      profilesMap.set(seed.username, savedProfile);
      console.log(`Created user & profile for ${seed.username} with UUID: ${savedUser.uuid}`);
    }

    console.log('Establishing friend links...');
    const friendsList: [string, string][] = [
      ['johndoe', 'janesmith'],
      ['johndoe', 'alicej'],
      ['janesmith', 'bobb'],
      ['alicej', 'charlieg'],
    ];

    for (const [u1, u2] of friendsList) {
      const p1 = profilesMap.get(u1);
      const p2 = profilesMap.get(u2);
      if (p1 && p2) {
        if (!p1.uuidFriendList.includes(p2.uuid)) {
          p1.uuidFriendList.push(p2.uuid);
        }
        if (!p2.uuidFriendList.includes(p1.uuid)) {
          p2.uuidFriendList.push(p1.uuid);
        }
      }
    }

    // Save updated profiles with friends lists
    for (const profile of profilesMap.values()) {
      await postgresDataSource.getRepository(ProfileEntity).save(profile);
    }
    console.log('Friend links established.');

    console.log('Seeding posts...');

    for (const p of seedPosts) {
      const profile = profilesMap.get(p.username);
      if (!profile) continue;

      const post = new PostEntity();
      post.creatorUuid = profile.uuid;
      post.creatorUsername = profile.username;
      post.message = p.message;

      post.createdAt = new Date(
        Date.now() - p.createdAtOffsetMinutes * 60 * 1000
      );

      post.userUuidExcludeList = [];
      post.postImages = [];

      await mongoDataSource.getRepository(PostEntity).save(post);

      console.log(
        `Created post by ${p.username} [${p.tags?.join(', ')}]: "${p.message.slice(0, 40)}..."`
      );
    }


    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    console.log('Closing database connections...');
    if (mongoDataSource.isInitialized) {
      await mongoDataSource.destroy();
    }
    if (postgresDataSource.isInitialized) {
      await postgresDataSource.destroy();
    }
    console.log('Connections closed.');
    process.exit(0);
  }
}

seed();
