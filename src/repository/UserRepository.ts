import { prisma } from '../../prisma'

class UserRepository {
    async findById(id: number) {
        const user = await prisma.user.findUnique({
            where: {
                id: id,
            },
        })
        console.log(user)

        return user
    }
}

export default new UserRepository()
