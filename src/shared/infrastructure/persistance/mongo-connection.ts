import { DataSource } from "typeorm";

const dbPort = parseInt(process.env.DB_PORT || "27017");

const appDataSource = new DataSource({
    type: "mongodb",
    host: process.env.DB_HOST || "localhost",
    port: dbPort,
    database: "social_media",
    entities: ["./**/*.entity.ts"],
    synchronize: true,
    logging: true,
});

appDataSource.initialize().then(() => {
    console.log("Data Source has been initialized!")
}).catch((err) => {
    console.error("Error during Data Source initialization", err)
    throw new Error("Error during Data Source initialization")
})

export default appDataSource;