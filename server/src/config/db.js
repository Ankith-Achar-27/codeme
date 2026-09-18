import mongoose from 'mongoose'

export async function connectDatabase({ required = false } = {}) {
  const { MONGODB_URI } = process.env

  if (!MONGODB_URI) {
    console.info('MONGODB_URI is not set; starting API without a database connection.')
    if (required) {
      throw new Error('MONGODB_URI is required for this command.')
    }

    return null
  }

  try {
    await mongoose.connect(MONGODB_URI)
    console.info('MongoDB connected.')
    return mongoose.connection
  } catch (error) {
    console.error(`MongoDB connection failed: ${error.message}`)
    if (required) {
      throw error
    }

    return null
  }
}
