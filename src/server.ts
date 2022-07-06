import 'dotenv/config'
import express from 'express'
import './postgres'
import router from './routes'

import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'

import Queue from './lib/Queue'
import { redisSubscriberClient } from './config/redisConfig'
import axios from 'axios'
import setSubscribers, { Subscribers } from './service/Subscribers'

const serverAdapter = new ExpressAdapter()

createBullBoard({
    queues: Queue.queues.map((queue) => new BullAdapter(queue.bull)),
    serverAdapter,
})

const app = express()

serverAdapter.setBasePath('/admin/queues')
app.use('/admin/queues', serverAdapter.getRouter())
app.use(express.json())
app.use(router)
setSubscribers(redisSubscriberClient)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on PORT  ${PORT}`))
