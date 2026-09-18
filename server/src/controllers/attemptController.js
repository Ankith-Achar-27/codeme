import mongoose from 'mongoose'
import Attempt from '../models/Attempt.js'
import Problem from '../models/Problem.js'
import User from '../models/User.js'

const validStatuses = ['solved', 'solved_with_hint', 'failed', 'viewed_solution']

export async function createAttempt(request, response, next) {
  try {
    const { userId, problemId, status, attemptCount, timeTaken, hintsUsed } = request.body

    if (!userId || !problemId || !status) {
      return response.status(400).json({ success: false, message: 'userId, problemId, and status are required.' })
    }
    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(problemId)) {
      return response.status(400).json({ success: false, message: 'Provide valid user and problem IDs.' })
    }
    if (!validStatuses.includes(status)) {
      return response.status(400).json({ success: false, message: 'Provide a valid attempt status.' })
    }

    const [user, problem] = await Promise.all([User.exists({ _id: userId }), Problem.exists({ _id: problemId })])
    if (!user || !problem) {
      return response.status(404).json({ success: false, message: 'The selected user or problem was not found.' })
    }

    const attempt = await Attempt.create({ userId, problemId, status, attemptCount, timeTaken, hintsUsed })
    return response.status(201).json({ success: true, data: attempt })
  } catch (error) {
    if (error.name === 'ValidationError') {
      return response.status(400).json({ success: false, message: 'Check the attempt details and try again.' })
    }
    return next(error)
  }
}

export async function getAttemptsByUser(request, response, next) {
  try {
    const { userId } = request.params
    const page = Math.max(Number.parseInt(request.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(Number.parseInt(request.query.limit, 10) || 10, 1), 50)

    if (!mongoose.isValidObjectId(userId) || !(await User.exists({ _id: userId }))) {
      return response.status(404).json({ success: false, message: 'User not found.' })
    }

    const [attempts, total, statusCounts] = await Promise.all([
      Attempt.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('problemId', 'title difficulty topics')
        .lean(),
      Attempt.countDocuments({ userId }),
      Attempt.aggregate([{ $match: { userId: new mongoose.Types.ObjectId(userId) } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
    ])

    const summary = statusCounts.reduce((result, item) => ({ ...result, [item._id]: item.count }), {
      totalAttempts: total,
      solved: 0,
      solved_with_hint: 0,
      failed: 0,
      viewed_solution: 0,
    })

    response.json({
      success: true,
      data: attempts,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
      summary,
    })
  } catch (error) {
    next(error)
  }
}
