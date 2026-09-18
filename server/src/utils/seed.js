import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import problems from '../data/problems.js'
import Problem from '../models/Problem.js'

async function seedProblems() {
  try {
    await connectDatabase({ required: true })
    const slugs = problems.map((problem) => problem.slug)
    await Problem.deleteMany({ slug: { $in: slugs } })
    const insertedProblems = await Problem.insertMany(problems)
    console.info(`Seeded ${insertedProblems.length} CodeMe problems.`)
  } finally {
    await mongoose.disconnect()
  }
}

seedProblems().catch((error) => {
  console.error(`Seeding failed: ${error.message}`)
  process.exitCode = 1
})
