import "dotenv/config";
import userRoutes from "@auth/infraestructure/routes.js";
import fastifyCookie from "@fastify/cookie";
import fastifyCors from "@fastify/cors";
import multipart from "@fastify/multipart";
import fastifySession from "@fastify/session";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import postRoutes from "@posts/infrastructure/routes.js";
import profileRoutes from "@profiles/infraestructure/routes.js";
import fastify, { type FastifyInstance } from "fastify";
import fs from "fs";
import type { IncomingMessage, ServerResponse } from "http";
import type { Http2ServerRequest, Http2ServerResponse, SecureServerOptions } from "http2";
import "reflect-metadata";
import { getRedisStore } from "./redis-store.js";

function getHttpsConfig():
	| SecureServerOptions<
			typeof IncomingMessage,
			typeof ServerResponse,
			typeof Http2ServerRequest,
			typeof Http2ServerResponse
	  >
	| undefined {
	if (process.env.OVER_HTTPS != "true") return undefined;

	return {
		allowHTTP1: true,
		key: fs.readFileSync(process.env.SSL_KEY_PATH),
		cert: fs.readFileSync(process.env.SSL_CERT_PATH),
	};
}

function registerSwagger(app: FastifyInstance) {
	if (process.env.ENVIRONMENT === "production") return;
	app.register(fastifySwagger, {
		openapi: {
			info: {
				title: "Social Media API",
				description: "Fastify API documentation",
				version: "A-0.0.1",
			},
		},
	});

	app.register(fastifySwaggerUi, {
		routePrefix: "/api/docs",
		uiConfig: {
			deepLinking: false,
		},
		staticCSP: true,
		transformSpecificationClone: true,
	});
}

function registerModules(app: FastifyInstance) {
	app.register(multipart, {
		attachFieldsToBody: true,
		limits: {
			fieldNameSize: 20,
			fieldSize: 10 * 1024 * 1024,
			files: 5,
		},
	});

	app.register(fastifyCors, {
		credentials: true,
		origin: process.env.ALLOWED_ORIGINS.split(","),
		methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	});

	app.register(fastifyCookie);

	app.register(fastifySession, {
		cookieName: "session",
		secret: process.env.FASTIFY_SESSION_SECRET,
		saveUninitialized: false,
		rolling: false,
		store: getRedisStore(),
		cookie: {
			secure: process.env.OVER_HTTPS === "true",
			httpOnly: true,
			path: "/",
			sameSite: "lax",
			maxAge: Number(process.env.SESSION_MS_DURATION) || 1000 * 60 * 10,
		},
	});
}

function registerRoutes(app: FastifyInstance) {
	app.register(postRoutes);
	app.register(userRoutes);
	app.register(profileRoutes);
}

function createServer() {
	const fastifyApp = fastify({
		logger: true,
		https: getHttpsConfig(),
	});
	registerModules(fastifyApp);
	registerRoutes(fastifyApp);
	registerSwagger(fastifyApp);
	return fastifyApp;
}

export { createServer };
