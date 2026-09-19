import cors from 'cors'
import express from 'express'
import aiRoutes from './routes/aiRoutes.js'
import attemptRoutes from './routes/attemptRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import problemRoutes from './routes/problemRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }))
app.use(express.json())

app.use('/api', healthRoutes)
app.use('/api/problems', problemRoutes)
app.use('/api/attempts', attemptRoutes)
app.use('/api/users', userRoutes)
app.use('/api/ai', aiRoutes)


app.use((error, _request, response, _next) => {
  console.error(error)
  response.status(500).json({ success: false, message: 'Something went wrong. Please try again.' })
})

export default app
