import { initDb as postgresInit } from "./profiles/infraestructure/persistance/postgres-connection.js";
import { createServer } from "./shared/infrastructure/fastify/app.js";
import { initDb as mongoInit } from "./shared/infrastructure/persistance/mongo-connection.js";

async function start() {
	const server = createServer();
	await mongoInit();
	server.log.info("Connected to MongoDB");
	await postgresInit();
	server.log.info("Connected to Postgresql");
	await server.listen({
		port: Number(process.env.APP_PORT) || 3000,
		host: String(process.env.WEB_HOST) || "localhost",
	});
}

start();
