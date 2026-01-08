import "dotenv/config";
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import fastifySwagger from '@fastify/swagger';
import fastifyCors from "@fastify/cors";
import fastifySwaggerUi from '@fastify/swagger-ui';
import postRoutes from '@posts/infrastructure/routes.js';
import userRoutes from '@auth/infraestructure/routes.js';
import multipart from '@fastify/multipart';
import fs from 'fs';
import { initDb } from "@shared/infrastructure/persistance/mongo-connection.js";

const envToLogger = {
    development: {
        transport: {
            target: 'pino-pretty',
            options: {
                translateTime: 'HH:MM:ss Z',
                ignore: 'pid,hostname',
            },
        },
    },
    production: process.env.ENVIRONMENT === 'production',
    test: false,
};

const fastifyApp = fastify({
    logger: envToLogger["development"],
    http2: true,
    https: {
        allowHTTP1: true,
        key: fs.readFileSync(process.env.SSL_KEY_PATH),
        cert: fs.readFileSync(process.env.SSL_CERT_PATH)
    }
});

fastifyApp.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 20,
        fieldSize: 10 * 1024 * 1024,
        files: 5,
    }
});

/* Middleware */

if (process.env.ENVIRONMENT !== 'production') {
    fastifyApp.register(fastifySwagger, {
        openapi: {
            info: {
                title: 'Social Media API',
                description: 'Fastify API documentation',
                version: 'A-0.0.1',
            }
        }
    });

    fastifyApp.register(fastifySwaggerUi, {
        routePrefix: '/api/docs',
        uiConfig: {
            deepLinking: false
        },
        staticCSP: true,
        transformSpecificationClone: true
    });
}

fastifyApp.register(fastifyCors, {
    credentials: true,
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

fastifyApp.register(fastifyCookie);
fastifyApp.register(fastifySession, {
    cookieName: 'session',
    secret: process.env.FASTIFY_SESSION_SECRET,
    store: new fastifySession.MemoryStore(),
    cookie: {
        secure: false,
        httpOnly: true,
        path: "/",
        sameSite: "lax",
    }
});

/* Routes */
fastifyApp.register(postRoutes);
fastifyApp.register(userRoutes);

(async () => {
    try {
        fastifyApp.log.info("Connecting to DB");
        await initDb();
        fastifyApp.log.info("DB connected");
        fastifyApp.listen({
            port: parseInt(process.env.APP_PORT) || 3000
        });
    } catch (err) {
        fastifyApp.log.error(err);
        process.exit(1);
    }
})();
