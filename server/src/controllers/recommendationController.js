import mongoose from 'mongoose'
import User from '../models/User.js'
import { getRecommendationsForUser } from '../services/recommendationService.js'

function parseLimit(value) {
  return Math.min(Math.max(Number.parseInt(value, 10) || 5, 1), 20)
}

async function findUser(id) {
  if (!mongoose.isValidObjectId(id)) return null
  return User.exists({ _id: id })
}

function databaseIsUnavailable(response) {
  if (mongoose.connection.readyState === 1) return false
  response.status(503).json({ success: false, message: 'Recommendations are unavailable until MongoDB is connected.' })
  return true
}

export async function getRecommendation(request, response, next) {
  try {
    if (databaseIsUnavailable(response)) return undefined
    if (!(await findUser(request.params.id))) return response.status(404).json({ success: false, message: 'User not found.' })
    const [recommendation] = await getRecommendationsForUser(request.params.id)
    if (!recommendation) return response.status(404).json({ success: false, message: 'No problems are available for recommendation.' })
    return response.json({ success: true, data: recommendation })
  } catch (error) {
    return next(error)
  }
}

export async function getRankedRecommendations(request, response, next) {
  try {
    if (databaseIsUnavailable(response)) return undefined
    if (!(await findUser(request.params.id))) return response.status(404).json({ success: false, message: 'User not found.' })
    const recommendations = await getRecommendationsForUser(request.params.id, { limit: parseLimit(request.query.limit) })
    return response.json({ success: true, data: recommendations })
  } catch (error) {
    return next(error)
  }
}
