import { Router } from 'express'
import { CreateUserController } from './controllers/CreateUserController'
import { EmailController } from './controllers/EmailController'
import { GetUserInfoController } from './controllers/GetUserInfoController'
import { LoginUserController } from './controllers/LoginUserController'
import { XSSController } from './controllers/XSSController'
import { authentication } from './middleware/auth'

const router = Router()

const createUserController = new CreateUserController()
const loginUserController = new LoginUserController()
const getUserInfoController = new GetUserInfoController()
const xssController = new XSSController()
const emailController = new EmailController()

router.post('/email', emailController.handle)

router.get('/xss', xssController.handleRead)
router.post('/xss', xssController.handle)

router.post('/users', createUserController.handleUsingPrisma)

router.post('/login', loginUserController.handlePrisma)
router.get('/users/profile', authentication, getUserInfoController.handlePrisma)

export default router
