import Queue from 'bull'
import { redisConfig } from '../config/redisConfig'

import RegistrationMail from '../jobs/RegistrationMail'

const mailQueue = new Queue(RegistrationMail.key, { redis: redisConfig })

export default mailQueue
