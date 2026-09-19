import mongoose from 'mongoose'
import User from '../models/User.js'
import { getUserAnalyticsData } from '../services/analyticsService.js'

async function findUser(id) {
  if (!mongoose.isValidObjectId(id)) return null
  return User.exists({ _id: id })
}

function databaseIsUnavailable(response) {
  if (mongoose.connection.readyState === 1) return false
  response.status(503).json({ success: false, message: 'Analytics are unavailable until MongoDB is connected.' })
  return true
}

export async function getUserAnalytics(request, response, next) {
  try {
    if (databaseIsUnavailable(response)) return undefined
    const userId = request.params.id || request.params.userId
    if (!(await findUser(userId))) {
      return response.status(404).json({ success: false, message: 'User not found.' })
    }

    const analytics = await getUserAnalyticsData(userId)
    return response.json({ success: true, data: analytics })
  } catch (error) {
    return next(error)
  }
}
