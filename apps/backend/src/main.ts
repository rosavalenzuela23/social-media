import { initDb as postgresInit } from "./profiles/infraestructure/persistance/postgres-connection.js";
import { createServer } from "./shared/infrastructure/fastify/app.js";
import { RabbitMQService } from "./shared/infrastructure/rabbit/rabbitmq-queues.js";
import { redisClient } from "./shared/infrastructure/fastify/redis-store.js";
import { initDb as mongoInit } from "./shared/infrastructure/persistance/mongo-connection.js";

async function start() {
	const server = createServer();
	await mongoInit();
	server.log.info("Connected to MongoDB");
	await postgresInit();
	server.log.info("Connected to Postgresql");
	await redisClient.connect();
	server.log.info("Connected to Redis");
  RabbitMQService.getInstance(process.env.RABBITMQ_URL);
  server.log.info("RabbitMQ Service initialized");


	await server.listen({
		port: Number(process.env.APP_PORT) || 3000,
		host: String(process.env.WEB_HOST) || "localhost",
	});
}

start();
