import { Router } from 'express'
import { getRankedRecommendations, getRecommendation } from '../controllers/recommendationController.js'
import { getOrCreateDemoUser } from '../controllers/userController.js'

const router = Router()

router.post('/demo', getOrCreateDemoUser)
router.get('/:id/recommendation', getRecommendation)
router.get('/:id/recommendations', getRankedRecommendations)

export default router
