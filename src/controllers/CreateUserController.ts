import { hash } from 'bcryptjs'
import { Request, Response } from 'express'
import { v4 as uuid } from 'uuid'
import { prisma } from '../../prisma'
import { createConnection } from '../postgres'

export class CreateUserController {
    async handle(request: Request, response: Response) {
        const { username, name, password } = request.body

        const clientConnection = await createConnection()

        const { rows } = await clientConnection.query(
            `SELECT * FROM USERS WHERE USERNAME  = $1 LIMIT 1`,
            [username],
        )

        const userExists = rows[0]

        if (userExists) {
            return response.status(400).json({ error: 'User already exists' })
        }

        const passwordHash = await hash(password, 8)

        const id = uuid()

        await clientConnection.query(
            `INSERT INTO USERS(ID,NAME,USERNAME,PASSWORD) VALUES($1,$2,$3,$4)`,
            [id, name, username, passwordHash],
        )

        return response.send()
    }

    async handleUsingPrisma(request: Request, response: Response) {
        const { username, name, password } = request.body

        const user = await prisma.user.findFirst({
            where: {
                name,
            },
        })

        console.log(user, 'uer')

        if (user) {
            return response.status(400).json({ error: 'User already exists' })
        }

        const passwordHash = await hash(password, 8)

        const id = uuid()

        const createdUser = await prisma.user.create({
            data: {
                username,
                name,
                email: id,
                password: passwordHash,
            },
        })

        return response.send(createdUser)
    }
}
