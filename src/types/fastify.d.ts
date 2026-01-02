import 'fastify';
import FastifySessionObject from '@fastify/session';

declare module 'fastify' {
    
    interface Session {
        user?: {
            username: string,
            uuid: string
        }
    }
    
    interface FastifyRequest {
        files?: any
    }

}