import 'dotenv/config'
import mongoose from 'mongoose'
import { connectDatabase } from '../config/db.js'
import problems from '../data/problems.js'
import Problem from '../models/Problem.js'

async function removeInvalidProblemIndexes() {
  try {
    const indexes = await Problem.collection.indexes()
    const invalidIndexes = indexes.filter((index) => {
      const fields = Object.keys(index.key)
      return fields.includes('topics') && fields.includes('concepts')
    })

    for (const index of invalidIndexes) {
      await Problem.collection.dropIndex(index.name)
      console.info(`Removed invalid parallel-array index: ${index.name}`)
    }
  } catch (error) {
    if (error.codeName !== 'NamespaceNotFound') throw error
  }
}

async function seedProblems() {
  try {
    await connectDatabase({ required: true })
    await removeInvalidProblemIndexes()
    await Problem.createIndexes()
    const bulkOps = problems.map((problem) => ({
      updateOne: {
        filter: { slug: problem.slug },
        update: { $set: problem },
        upsert: true,
      },
    }))
    await Problem.bulkWrite(bulkOps)
    const count = await Problem.countDocuments()
    console.info(`Synchronized ${problems.length} CodeMe problems. Total in database: ${count}.`)
  } finally {
    await mongoose.disconnect()
  }
}

seedProblems().catch((error) => {
  console.error(`Seeding failed: ${error.message}`)
  process.exitCode = 1
})
