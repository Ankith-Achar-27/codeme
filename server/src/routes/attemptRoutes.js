import { Router } from 'express'
import { createAttempt, getAttemptsByUser } from '../controllers/attemptController.js'

const router = Router()

router.post('/', createAttempt)
router.get('/:userId', getAttemptsByUser)

export default router
