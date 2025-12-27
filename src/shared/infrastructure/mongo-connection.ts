import { DataSource } from "typeorm";

const appDataSource = new DataSource({
    type: "mongodb",
    host: "localhost",
    port: 27017,
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