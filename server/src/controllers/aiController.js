import mongoose from 'mongoose'
import Problem from '../models/Problem.js'
import { generateAiExplanation, generateAiHints } from '../services/aiService.js'

function databaseIsUnavailable(response) {
  if (mongoose.connection.readyState === 1) return false
  response.status(503).json({ success: false, message: 'Database connection is unavailable.' })
  return true
}

export async function getHint(request, response, next) {
  try {
    const { problemId, hintLevel } = request.body || {}

    if (!problemId) {
      return response.status(400).json({ success: false, message: 'problemId is required.' })
    }

    if (!mongoose.isValidObjectId(problemId)) {
      return response.status(400).json({ success: false, message: 'Provide a valid problem ID.' })
    }

    if (hintLevel !== undefined && hintLevel !== null) {
      const level = Number.parseInt(hintLevel, 10)
      if (![1, 2, 3].includes(level)) {
        return response.status(400).json({ success: false, message: 'hintLevel must be an integer between 1 and 3.' })
      }
    }

    if (databaseIsUnavailable(response)) return undefined

    const problem = await Problem.findById(problemId).lean()
    if (!problem) {
      return response.status(404).json({ success: false, message: 'Problem not found.' })
    }

    const result = await generateAiHints(problem)
    return response.json({ success: true, data: result })
  } catch (error) {
    if (error.status === 503 || error.status === 502 || error.status === 400) {
      return response.status(error.status).json({ success: false, message: error.message })
    }
    return next(error)
  }
}

export async function getExplanation(request, response, next) {
  try {
    const { problemId } = request.body || {}

    if (!problemId) {
      return response.status(400).json({ success: false, message: 'problemId is required.' })
    }

    if (!mongoose.isValidObjectId(problemId)) {
      return response.status(400).json({ success: false, message: 'Provide a valid problem ID.' })
    }

    if (databaseIsUnavailable(response)) return undefined

    const problem = await Problem.findById(problemId).lean()
    if (!problem) {
      return response.status(404).json({ success: false, message: 'Problem not found.' })
    }

    const result = await generateAiExplanation(problem)
    return response.json({ success: true, data: result })
  } catch (error) {
    if (error.status === 503 || error.status === 502 || error.status === 400) {
      return response.status(error.status).json({ success: false, message: error.message })
    }
    return next(error)
  }
}
