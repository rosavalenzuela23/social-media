import UserEntity from "@/auth/infraestructure/persistance/entities/user.entity.js";
import CommentEntity from "@/posts/infrastructure/persistance/entities/comment.entity.js";
import ImageEntity from "@/posts/infrastructure/persistance/entities/image.entity.js";
import PostEntity from "@/posts/infrastructure/persistance/entities/post.entity.js";
import ProfileEntity from "@/profiles/infraestructure/persistance/entities/profile.entity.js";
import { DataSource } from "typeorm";

const dbPort = parseInt(process.env.MONGO_PORT || "27017");

const appDataSource = new DataSource({
	type: "mongodb",
	host: process.env.MONGO_HOST || "localhost",
	port: dbPort,
	database: "social_media",
	entities: [ProfileEntity, UserEntity, PostEntity, ImageEntity, CommentEntity],
	connectTimeoutMS: 1000,
	synchronize: true,
	logging: true,
});

const initDb = async () => {
	try {
		await appDataSource.initialize();
	} catch (error) {
		console.error("Error connecting to MongoDB:", error);
		throw error;
	}
};

export { appDataSource, initDb };
