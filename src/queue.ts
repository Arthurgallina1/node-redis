import 'dotenv/config'

import Queue from './lib/Queue'
import RegistrationMail from './jobs/RegistrationMail'

// Queue.process(RegistrationMail.handle)
Queue.process() // process all queues instead of just one
