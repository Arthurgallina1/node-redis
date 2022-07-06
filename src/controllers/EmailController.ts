import { Request, Response } from 'express'
import Mail from '../lib/Mail'
import { getRedis } from '../redisConfig'
import userRepository from '../repository/UserRepository'

export class EmailController {
    async handle(request: Request, response: Response) {
        const { username, email, password } = request.body

        const user = {
            username,
            email,
            password,
        }

        Mail.sendMail({
            from: 'Test <test@teste.com.br>',
            to: `${username}<${email}>`,
            subject: 'Cadastro de usuário',
            html: `Olá, ${username}, bem-vindo ao sistema de fila`,
        })

        return response.json(user)
    }
}
