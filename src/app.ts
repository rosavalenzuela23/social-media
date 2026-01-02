import "dotenv/config";
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import postRoutes from '@posts/infrastructure/routes.js';
import userRoutes from '@users/infraestructure/routes.js';
import multipart from '@fastify/multipart';
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
    logger: envToLogger["development"]
})

fastifyApp.register(multipart, {
    attachFieldsToBody: true,
    limits: {
        fieldNameSize: 20,
        fieldSize: 10 * 1024 * 1024,
        files: 5,
    }
});

/* Middleware */
fastifyApp.register(fastifyCookie);
fastifyApp.register(fastifySession, {
    cookieName: 'session',
    secret: process.env.FASTIFY_SESSION_SECRET,
    store: new fastifySession.MemoryStore(),
    cookie: {
        secure: false
    }
})

/* Routes */
fastifyApp.register(postRoutes);
fastifyApp.register(userRoutes);

(async () => {
    try {
        await initDb()
        fastifyApp.listen({
            port: parseInt(process.env.APP_PORT) || 3000
        })
    } catch (err) {
        fastifyApp.log.error(err)
        process.exit(1)
    }
})()
