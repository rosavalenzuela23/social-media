import ProfileEntity from "@/profiles/infraestructure/persistance/entities/profile.entity.js";
import { DataSource } from "typeorm";

const dbPort = parseInt(process.env.PROFILE_DB_PORT || "5432");

const appDataSource = new DataSource({
	type: "postgres",
	password: String(process.env.PROFILE_DB_PASSWORD),
	username: String(process.env.PROFILE_DB_USER),
	host: process.env.PROFILE_DB_HOST || "localhost",
	port: dbPort,
	database: "social_media",
	entities: [ProfileEntity],
	connectTimeoutMS: 500,
	synchronize: true,
	logging: false,
});

const initDb = async () => {
	try {
		await appDataSource.initialize();
	} catch (error) {
		console.error("Error connecting to PostgresDB:", error);
		throw error;
	}
};

export { appDataSource, initDb };
