import 'dotenv/config'
import express from 'express'
import './postgres'
import router from './routes'

import { ExpressAdapter } from '@bull-board/express'
import { createBullBoard } from '@bull-board/api'
import { BullAdapter } from '@bull-board/api/bullAdapter'

import Queue from './lib/Queue'

const serverAdapter = new ExpressAdapter()

const { addQueue, removeQueue, setQueues, replaceQueues } = createBullBoard({
    queues: Queue.queues.map((queue) => new BullAdapter(queue.bull)), //[new BullAdapter(someQueue), new BullAdapter(someOtherQueue), new BullMQAdapter(queueMQ)],
    serverAdapter,
})

const app = express()

serverAdapter.setBasePath('/admin/queues')
app.use('/admin/queues', serverAdapter.getRouter())
app.use(express.json())
app.use(router)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => console.log(`Server is running on PORT  ${PORT}`))
