import axios from 'axios'
import { Redis } from 'ioredis'

export default async function setSubscribers(redisSubscriber: Redis) {
    redisSubscriber.subscribe('article', (err, count) => {
        console.log(`subscribed to ${count} channels`)
    })

    redisSubscriber.on('message', async (channel, message) => {
        console.log(`Received message from ${channel} channel.`)
        console.log(typeof message === 'string' ? message : JSON.parse(message))
        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/todos/1',
        )
        console.log(response.data)
    })
}

export class Subscribers {
    subscriber

    constructor(client: Redis) {
        this.subscriber = client
    }

    async setSubscribers() {
        this.subscriber.subscribe('article', (err, count) => {
            console.log(`subscribed to ${count} channels`)
        })

        this.subscriber.on('message', async (channel, message) => {
            console.log(`Received message from ${channel} channel.`)
            console.log(
                typeof message === 'string' ? message : JSON.parse(message),
            )
            const response = await axios.get(
                'https://jsonplaceholder.typicode.com/todos/1',
            )
            console.log(response.data)
        })
    }
}
