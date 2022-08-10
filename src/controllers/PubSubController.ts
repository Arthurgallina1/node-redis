import { Response, Request } from 'express'
import { prisma } from '../../prisma'
import { redisClient } from '../config/redisConfig'

export class PubSubController {
    async publish(request: Request, response: Response) {
        const users = await prisma.user.findMany()
        await redisClient.publish('article', JSON.stringify({ users }))

        return response.json(users)
    }
}
