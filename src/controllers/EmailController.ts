import { Request, Response } from 'express'
import Mail from '../lib/Mail'
import Queue from '../lib/Queue'

import { getRedis } from '../config/redisConfig'
import userRepository from '../repository/UserRepository'

export class EmailController {
    async handle(request: Request, response: Response) {
        const { username, email, password } = request.body

        const user = {
            username,
            email,
            password,
        }

        await Queue.add({ user })

        return response.json(user)
    }
}
