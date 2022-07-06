import Redis from 'ioredis'
import { promisify } from 'util'

const redisConfig = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
}

const redisClient = new Redis()

function getRedis(value: string) {
    const syncRedisGet = promisify(redisClient.get).bind(redisClient)
    return syncRedisGet(value)

    // redisClient.get("")
}

function setRedis(key: string, value: string) {
    const syncRedisSet = promisify(redisClient.set).bind(redisClient)
    return syncRedisSet(key, value)

    // redisClient.set("", "")
}

export { redisClient, redisConfig, getRedis, setRedis }
