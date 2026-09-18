import { Router } from 'express'
import { getOrCreateDemoUser } from '../controllers/userController.js'

const router = Router()

router.post('/demo', getOrCreateDemoUser)

export default router
