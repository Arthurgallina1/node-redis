import { Response, Request } from 'express'
import { prisma } from '../../prisma'
import { redisClient } from '../config/redisConfig'
import { createConnection } from '../postgres'

export class XSSController {
    errorCount = 0

    async handle(request: Request, response: Response) {
        const { username, name, password } = request.body
        await redisClient.publish('article', JSON.stringify({ name: 'art' }))
        const user = await prisma.user.findMany()

        return response.json(user)
    }

    async handleRead(request: Request, response: Response) {
        if (Date.now() % 2 === 0) {
            return response.status(403).json()
        }

        const user = await prisma.user.findMany()
        return response.json(user)
    }
}
