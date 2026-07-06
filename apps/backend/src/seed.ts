import "reflect-metadata";
import "dotenv/config";
import {
	appDataSource as mongoDataSource,
	initDb as initMongo,
} from "./shared/infrastructure/persistance/mongo-connection.js";
import {
	appDataSource as postgresDataSource,
	initDb as initPostgres,
} from "./profiles/infraestructure/persistance/postgres-connection.js";
import UserEntity from "./auth/infraestructure/persistance/entities/user.entity.js";
import ProfileEntity from "./profiles/infraestructure/persistance/entities/profile.entity.js";
import PostEntity from "./posts/infrastructure/persistance/entities/post.entity.js";
import CommentEntity from "./posts/infrastructure/persistance/entities/comment.entity.js";
import bcrypt from "bcrypt";

async function seed() {
	try {
		console.log("Connecting to databases...");
		await initMongo();
		console.log("Connected to MongoDB.");
		await initPostgres();
		console.log("Connected to PostgreSQL.");

		console.log("Clearing old database records...");
		await mongoDataSource.getRepository(PostEntity).clear();
		await mongoDataSource.getRepository(UserEntity).clear();
		await postgresDataSource.getRepository(ProfileEntity).clear();
		console.log("Old records cleared.");

		console.log("Hashing passwords...");
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash("password123", salt);

		console.log("Seeding users and profiles...");
		const seedUsers = [
			{ name: "John Doe", username: "johndoe" },
			{ name: "Jane Smith", username: "janesmith" },
			{ name: "Alice Johnson", username: "alicej" },
			{ name: "Bob Brown", username: "bobb" },
			{ name: "Charlie Green", username: "charlieg" },
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

		console.log("Establishing friend links...");
		const friendsList: [string, string][] = [
			["johndoe", "janesmith"],
			["johndoe", "alicej"],
			["janesmith", "bobb"],
			["alicej", "charlieg"],
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
		console.log("Friend links established.");

		console.log("Seeding posts...");
		const postsData = [
			{
				username: "johndoe",
				message:
					"Just got a new Golden Retriever puppy today! He's so fluffy and keeps chewing on my shoes. 🐾🐶",
				createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
				comments: [
					{
						username: "janesmith",
						message: "Oh my gosh, what's his name? Puppies are the absolute best!",
					},
					{
						username: "bobb",
						message: "Get ready for a lot of chew toys! Golden Retrievers have infinite energy.",
					},
				],
			},
			{
				username: "janesmith",
				message:
					"Had a wonderful time volunteering at the cat shelter this morning. So many cute kittens waiting for a home! 🐱",
				createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
				comments: [
					{
						username: "alicej",
						message: "I've been thinking about adopting a cat. Maybe I should visit!",
					},
				],
			},
			{
				username: "alicej",
				message:
					"Fascinating documentary about the migration patterns of monarch butterflies. Nature's navigation systems are incredible! 🦋",
				createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
				comments: [
					{
						username: "charlieg",
						message: "I saw a few in my garden yesterday! Truly beautiful insects.",
					},
				],
			},
			{
				username: "bobb",
				message:
					"Did you know that sea otters hold hands when they sleep so they don't drift apart? Absolutely adorable! 🦦",
				createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
				comments: [
					{
						username: "johndoe",
						message: "No way! That is the cutest animal fact I've ever heard.",
					},
				],
			},
			{
				username: "charlieg",
				message:
					"Saw a family of deer in my backyard this evening. They were so graceful and calm. 🦌",
				createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
				comments: [
					{
						username: "janesmith",
						message: "You're so lucky! I only ever see squirrels in my yard.",
					},
				],
			},
			{
				username: "johndoe",
				message:
					"Watching the birds at my new garden feeder. A couple of blue jays and a cardinal just stopped by! 🐦",
				createdAt: new Date(Date.now() - 30 * 60 * 1000),
				comments: [
					{
						username: "alicej",
						message: "Cardinals are so striking against the green trees. Love birdwatching!",
					},
				],
			},
		];

		for (const p of postsData) {
			const profile = profilesMap.get(p.username);
			if (profile) {
				const post = new PostEntity();
				post.uuid = crypto.randomUUID();
				post.creatorUuid = profile.uuid;
				post.creatorUsername = profile.username;
				post.message = p.message;
				post.createdAt = p.createdAt;
				post.userUuidExcludeList = [];
				post.postImages = [];
				post.comments = [];

				if (p.comments) {
					for (const c of p.comments) {
						const commenterProfile = profilesMap.get(c.username);
						if (commenterProfile) {
							const comment = new CommentEntity();
							comment.uuid = crypto.randomUUID();
							comment.creatorUuid = commenterProfile.uuid;
							comment.creatorUsername = commenterProfile.username;
							comment.message = c.message;
							comment.date = new Date(p.createdAt.getTime() + 10 * 60 * 1000);
							comment.postUuid = post.uuid;
							post.comments.push(comment);
						}
					}
				}

				await mongoDataSource.getRepository(PostEntity).save(post);
				console.log(
					`Created post by ${p.username}: "${p.message.slice(0, 30)}..." with ${post.comments.length} comments`,
				);
			}
		}

		console.log("Database seeding completed successfully!");
	} catch (error) {
		console.error("Error seeding database:", error);
		process.exit(1);
	} finally {
		console.log("Closing database connections...");
		if (mongoDataSource.isInitialized) {
			await mongoDataSource.destroy();
		}
		if (postgresDataSource.isInitialized) {
			await postgresDataSource.destroy();
		}
		console.log("Connections closed.");
		process.exit(0);
	}
}

seed();
