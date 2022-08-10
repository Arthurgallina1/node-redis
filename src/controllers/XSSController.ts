import { Response, Request } from 'express'
import { prisma } from '../../prisma'

export class XSSController {
    async handle(request: Request, response: Response) {
        const { username, name, password } = request.body
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
