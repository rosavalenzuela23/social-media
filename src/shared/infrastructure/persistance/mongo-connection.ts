import { DataSource } from "typeorm";

const dbPort = parseInt(process.env.DB_PORT || "27017");

const appDataSource = new DataSource({
    type: "mongodb",
    host: process.env.DB_HOST || "localhost",
    port: dbPort,
    database: "social_media",
    entities: ["./**/*.entity.*"],
    connectTimeoutMS: 500,
    synchronize: true,
    logging: true,
});

const initDb = async () => {
    try {
        await appDataSource.initialize();
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        throw error;
    }
};

export { appDataSource, initDb };