import { Request, Response } from 'express'
import { prisma } from '../../prisma'
import { createConnection, pgClient } from '../postgres'
import { getRedis } from '../config/redisConfig'
import userRepository from '../repository/UserRepository'

export class GetUserInfoController {
    async handle(request: Request, response: Response) {
        const { userId } = request
        console.time()

        // const users = await prisma.user.findMany()

        const userRedis = await getRedis(`user-${userId}`)

        if (userRedis) {
            console.timeEnd()
            return response.json(JSON.parse(userRedis))
        }

        const { rows } = await pgClient.pool.query(
            `SELECT * FROM USERS WHERE ID  = $1 LIMIT 1`,
            [userId],
        )

        console.timeEnd()

        return response.json(rows[0])
    }

    async handlePrisma(request: Request, response: Response) {
        const { userId } = request
        console.time()

        const userRedis = await getRedis(`user-${userId}`)

        if (userRedis) {
            console.timeEnd()
            return response.json(JSON.parse(userRedis))
        }

        const user = await userRepository.findById(Number(userId))

        return response.json(user)
    }
}
