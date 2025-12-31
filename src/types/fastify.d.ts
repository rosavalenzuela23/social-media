import 'fastify';

declare module 'fastify' {
    interface Session {
        user?: {
            username: string,
            uuid: string
        }
    }
}