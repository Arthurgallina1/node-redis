import { User } from '@prisma/client'
import { prisma } from '../../prisma'

class UserRepository {
    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        return user
    }

    async findByName(name: string) {
        const user = await prisma.user.findFirst({
            where: {
                name: name,
            },
        })
        console.log(user)

        return user
    }

    async create(user) {
        const { username, email, name, passwordHash, id } = user
        const createdUser = await prisma.user.create({
            data: {
                username,
                name,
                email,
                password: passwordHash,
            },
            select: {
                username: true,
                name: true,
                email: true,
            },
        })

        return createdUser
    }
}

export default new UserRepository()
