import { compare } from 'bcryptjs'
import { Request, Response } from 'express'
import { sign } from 'jsonwebtoken'
import { prisma } from '../../prisma'
import { createConnection } from '../postgres'
import { setRedis } from '../redisConfig'

type User = {
    username: string
    password: string
    name: string
    id: string
}

export class LoginUserController {
    async handle(request: Request, response: Response) {
        const { username, password } = request.body

        const clientConnection = await createConnection()

        const { rows } = await clientConnection.query(
            `SELECT * FROM USER WHERE NAME  = $1 LIMIT 1`,
            [username],
        )

        if (!rows[0]) {
            return response.status(401).end()
        }

        const user: User = rows[0]

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            return response.status(401).end()
        }

        const token = sign({}, process.env.JWT_SECRET, {
            subject: user.id,
        })

        //         user-${idUser}
        await setRedis(`user-${user.id}`, JSON.stringify(user))

        return response.json(token)
    }

    async handlePrisma(request: Request, response: Response) {
        const { name, password } = request.body

        const user = await prisma.user.findFirst({
            where: {
                name,
            },
        })

        console.log(user)

        if (!user) {
            return response.status(401).end()
        }

        // const user: User = rows[0]

        const passwordMatch = await compare(password, user.password)

        if (!passwordMatch) {
            return response.status(401).end()
        }

        const token = sign({}, process.env.JWT_SECRET, {
            subject: String(user.id),
        })

        //         user-${idUser}
        await setRedis(`user-${user.id}`, JSON.stringify(user))

        return response.json(token)
    }
}
