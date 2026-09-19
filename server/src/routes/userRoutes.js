import { Router } from 'express'
import { getUserAnalytics } from '../controllers/analyticsController.js'
import { getRankedRecommendations, getRecommendation } from '../controllers/recommendationController.js'
import { getOrCreateDemoUser } from '../controllers/userController.js'

const router = Router()

router.post('/demo', getOrCreateDemoUser)
router.get('/:id/recommendation', getRecommendation)
router.get('/:id/recommendations', getRankedRecommendations)
router.get('/:id/analytics', getUserAnalytics)

export default router

