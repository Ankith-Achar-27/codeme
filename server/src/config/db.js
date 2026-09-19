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

  const isProduction =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.RENDER)

  if (isProduction) {
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

  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
    console.info('MongoDB connected.')
    return mongoose.connection
  } catch (error) {
    console.warn(`Primary MongoDB connection failed: ${error.message}. Checking local MongoDB fallback...`)
    try {
      await mongoose.connect('mongodb://127.0.0.1:27017/codeme', { serverSelectionTimeoutMS: 3000 })
      console.info('Connected to local MongoDB (127.0.0.1:27017/codeme).')
      return mongoose.connection
    } catch (fallbackError) {
      console.error(`Local MongoDB connection also failed: ${fallbackError.message}`)
      if (required) {
        throw error
      }
      return null
    }
  }
}
