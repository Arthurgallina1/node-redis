import axios from 'axios'

export default {
    key: 'CallApi',
    options: {
        attempts: 3,
    },
    async handle({ data }) {
        const response = await axios.get('http://localhost:3000/xss')
        await new Promise((r) => setTimeout(r, 3000))

        console.log(response.data)
    },
}
