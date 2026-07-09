import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient({ url: process.env.REDIS_URL });

const getRedisStore = function (): RedisStore {
	const redisStore = new RedisStore({
		client: redisClient,
		prefix: "redis-store-for-backend-session",
	});

	return redisStore;
};


export { getRedisStore, redisClient };
