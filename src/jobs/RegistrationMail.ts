import Mail from '../lib/Mail'

export default {
    key: 'RegistrationMail',
    async handle({ data }) {
        const { user } = data

        await Mail.sendMail({
            from: 'Test <test@teste.com.br>',
            to: `${user.username}<${user.email}>`,
            subject: 'Cadastro de usuário',
            html: `Olá, ${user.username}, bem-vindo ao sistema de fila`,
        })
    },
}
