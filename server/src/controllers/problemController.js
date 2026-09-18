import mongoose from 'mongoose'
import Problem from '../models/Problem.js'

const parsePagination = (query) => {
  const page = Math.max(Number.parseInt(query.page, 10) || 1, 1)
  const limit = Math.min(Math.max(Number.parseInt(query.limit, 10) || 12, 1), 50)
  return { page, limit }
}

export async function getProblems(request, response, next) {
  try {
    const { page, limit } = parsePagination(request.query)
    const filter = {}

    if (request.query.search?.trim()) {
      filter.title = { $regex: request.query.search.trim(), $options: 'i' }
    }
    if (['Easy', 'Medium', 'Hard'].includes(request.query.difficulty)) {
      filter.difficulty = request.query.difficulty
    }
    if (request.query.topic?.trim()) {
      filter.topics = request.query.topic.trim()
    }

    const [problems, total] = await Promise.all([
      Problem.find(filter).sort({ title: 1 }).skip((page - 1) * limit).limit(limit).lean(),
      Problem.countDocuments(filter),
    ])

    response.json({
      success: true,
      data: problems,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (error) {
    next(error)
  }
}

export async function getProblemById(request, response, next) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return response.status(404).json({ success: false, message: 'Problem not found.' })
    }

    const problem = await Problem.findById(request.params.id).lean()
    if (!problem) {
      return response.status(404).json({ success: false, message: 'Problem not found.' })
    }

    return response.json({ success: true, data: problem })
  } catch (error) {
    return next(error)
  }
}
