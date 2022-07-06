import { Response, Request } from 'express'
import { prisma } from '../../prisma'
import { createConnection } from '../postgres'

export class XSSController {
    errorCount = 0

    async handle(request: Request, response: Response) {
        const { username, name, password } = request.body

        console.log(request.body)

        const user = await prisma.user.findMany()

        // const clientConnection = await createConnection()

        // const { rows } = await clientConnection.query(
        //     `SELECT * FROM USER`,
        //     [username],
        // )

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
