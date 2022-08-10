import axios from 'axios'
import { Redis } from 'ioredis'

export enum SubscribersTopics {
    ARTICLE = 'article',
    EMAIL = 'email',
}

const subscribersHandlers: { [key in SubscribersTopics]: (data: any) => void } =
    {
        [SubscribersTopics.ARTICLE]: async (data) => {
            console.log('article handler', JSON.parse(data))
            // const response = await axios.get(
            //     'https://jsonplaceholder.typicode.com/todos/1',
            // )
            // console.log(response.data)
        },
        [SubscribersTopics.EMAIL]: () => {
            console.log('email handler')
        },
    }

export default async function setSubscribers(redisSubscriber: Redis) {
    redisSubscriber.subscribe(SubscribersTopics.ARTICLE, (err, count) => {
        console.log(`subscribed to ${count} channels`)
    })

    redisSubscriber.subscribe(SubscribersTopics.EMAIL, (err, count) => {
        console.log(`subscribed to ${count} channels`)
    })

    redisSubscriber.on('message', async (channel, message) => {
        const handler = subscribersHandlers[channel as SubscribersTopics]
        console.log(`Received message from ${channel} channel.`)
        const data = typeof message === 'string' ? message : JSON.parse(message)
        // console.log(data)
        handler(message)
    })
}

// export class SubscribersSetter {
//     subscriber

//     constructor(client: Redis) {
//         this.subscriber = client
//     }

//     async setSubscribers() {
//         this.subscriber.subscribe('article', (err, count) => {
//             console.log(`subscribed to ${count} channels`)
//         })

//         this.subscriber.on('message', async (channel, message) => {
//             console.log(`Received message from ${channel} channel.`)
//             console.log(
//                 typeof message === 'string' ? message : JSON.parse(message),
//             )
//             const response = await axios.get(
//                 'https://jsonplaceholder.typicode.com/todos/1',
//             )
//             console.log(response.data)
//         })
//     }
// }
