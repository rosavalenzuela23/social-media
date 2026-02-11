import userRoutes from '@auth/infraestructure/routes.js';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import multipart from '@fastify/multipart';
import fastifySession from '@fastify/session';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import postRoutes from '@posts/infrastructure/routes.js';
import { initDb as postgresInit } from '@profiles/infraestructure/persistance/postgres-connection.js';
import profileRoutes from '@profiles/infraestructure/routes.js';
import { initDb as mongoInit } from '@shared/infrastructure/persistance/mongo-connection.js';
import MongoStore from 'connect-mongo';
import 'dotenv/config';
import fastify from 'fastify';
import fs from 'fs';
import 'reflect-metadata';

let httpsConfig;

if (process.env.OVER_HTTPS === 'true') {
  httpsConfig = {
    key: fs.readFileSync(process.env.SSL_KEY_PATH),
    cert: fs.readFileSync(process.env.SSL_CERT_PATH),
  };
}

const fastifyApp = fastify({
  logger: true,
  https: httpsConfig,
});

fastifyApp.register(multipart, {
  attachFieldsToBody: true,
  limits: {
    fieldNameSize: 20,
    fieldSize: 10 * 1024 * 1024,
    files: 5,
  },
});

/* Middleware */

if (process.env.ENVIRONMENT !== 'production') {
  fastifyApp.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Social Media API',
        description: 'Fastify API documentation',
        version: 'A-0.0.1',
      },
    },
  });

  fastifyApp.register(fastifySwaggerUi, {
    routePrefix: '/api/docs',
    uiConfig: {
      deepLinking: false,
    },
    staticCSP: true,
    transformSpecificationClone: true,
  });
}

fastifyApp.register(fastifyCors, {
  credentials: true,
  origin: process.env.ALLOWED_ORIGINS.split(','),
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
});

fastifyApp.register(fastifyCookie);
fastifyApp.register(fastifySession, {
  cookieName: 'session',
  secret: process.env.FASTIFY_SESSION_SECRET,
  saveUninitialized: false,
  rolling: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
  }),
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  },
});

/* Routes */
fastifyApp.register(postRoutes);
fastifyApp.register(userRoutes);
fastifyApp.register(profileRoutes);

(async () => {
  try {
    fastifyApp.log.info('Connecting to DB');
    await mongoInit();
    fastifyApp.log.info('Mongo connected');
    await postgresInit();
    fastifyApp.log.info('Postgres connected');
    fastifyApp.listen({
      port: parseInt(process.env.APP_PORT) || 3000,
    });
  } catch (err) {
    fastifyApp.log.error(err);
    process.exit(1);
  }
})();
