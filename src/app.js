import "dotenv/config";
import fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import fastifySession from '@fastify/session';
import postRoutes from './posts/infrastructure/routes';
import userRoutes from './users/infraestructure/routes';
import multipart from '@fastify/multipart';

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
  production: true, // Use default JSON logger for production
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
        files: 5, // See how to modify this value in the next section
    }
});

fastifyApp.register(fastifyCookie);
fastifyApp.register(fastifySession, {
    cookieName: 'session',
    secret: process.env.FASTIFY_SESSION_SECRET,
    store: new fastifySession.MemoryStore(),
    cookie: {
        secure: false
    }
})

fastifyApp.register(postRoutes);
fastifyApp.register(userRoutes);

(async () => {
    try {
        await fastifyApp.listen({
            port: process.env.APP_PORT || 3000
        })
    } catch (err) {
        fastifyApp.log.error(err)
        process.exit(1)
    }
})()
