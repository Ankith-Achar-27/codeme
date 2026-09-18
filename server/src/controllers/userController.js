import User from '../models/User.js'

const demoUser = { name: 'Demo Learner', email: 'demo@codeme.local' }

export async function getOrCreateDemoUser(_request, response, next) {
  try {
    const user = await User.findOneAndUpdate(
      { email: demoUser.email },
      { $setOnInsert: demoUser },
      { new: true, upsert: true, runValidators: true },
    ).lean()

    response.json({ success: true, data: user })
  } catch (error) {
    next(error)
  }
}
