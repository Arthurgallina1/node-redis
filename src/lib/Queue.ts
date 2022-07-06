import Queue from 'bull'
import { redisConfig } from '../config/redisConfig'

import * as jobs from '../jobs'

// import RegistrationMail from '../jobs/RegistrationMail'
// const mailQueue = new Queue(RegistrationMail.key, { redis: redisConfig })
// mailQueue.on('failed', (job) => {
//     console.log('job failed', job.data)
// })
// export default mailQueue

const queues = Object.values(jobs).map((job) => ({
    bull: new Queue(job.key, { redis: redisConfig }),
    name: job.key,
    handle: job.handle,
    options: job?.options,
}))

export default {
    queues,
    add(name: string, data: any) {
        const queue = queues.find((queue) => queue.name === name)
        queue.bull.add(data, queue.options)
    },
    process() {
        return queues.forEach((queue) => {
            queue.bull.process(queue.handle)
            queue.bull.on('failed', (job, err) => {
                console.log('job failed!', queue.name) //job.data, err
            })
            queue.bull.on('completed', (job) => {
                console.log('job scss', queue.name, job.data)
            })
        })
    },
}
