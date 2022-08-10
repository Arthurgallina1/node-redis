import { Router } from 'express'
import { CreateUserController } from './controllers/CreateUserController'
import { EmailController } from './controllers/EmailController'
import { GetUserInfoController } from './controllers/GetUserInfoController'
import { LeaderboardController } from './controllers/LeaderboardController'
import { LoginUserController } from './controllers/LoginUserController'
import { PubSubController } from './controllers/PubSubController'
import { XSSController } from './controllers/XSSController'
import { authentication } from './middleware/auth'

const router = Router()

const createUserController = new CreateUserController()
const loginUserController = new LoginUserController()
const getUserInfoController = new GetUserInfoController()
const xssController = new XSSController()
const pubSubController = new PubSubController()
const emailController = new EmailController()
const leaderboardController = new LeaderboardController()

router.post('/email', emailController.handle)

router.get('/pubsub/publish', pubSubController.publish)

router.get('/xss', xssController.handleRead)
router.post('/xss', xssController.handle)

router.post('/users', createUserController.handleUsingPrisma)

router.post('/login', loginUserController.handlePrisma)
router.get('/users/profile', authentication, getUserInfoController.handlePrisma)

router.get('/leaderboard', leaderboardController.handle)
router.get('/leaderboard/populate', leaderboardController.populate)

export default router
