import { Router } from 'express'
import { getExplanation, getHint } from '../controllers/aiController.js'

const router = Router()

router.post('/hint', getHint)
router.post('/explain', getExplanation)

export default router
