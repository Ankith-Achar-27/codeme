import cors from 'cors'
import express from 'express'
import aiRoutes from './routes/aiRoutes.js'
import attemptRoutes from './routes/attemptRoutes.js'
import healthRoutes from './routes/healthRoutes.js'
import problemRoutes from './routes/problemRoutes.js'
import userRoutes from './routes/userRoutes.js'

const app = express()

const clientUrl = process.env.CLIENT_URL
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  ...(clientUrl
    ? clientUrl.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    : []),
]

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, server-to-server, Render health checks)
      if (!origin || allowedOrigins.includes(origin) || (origin.endsWith('.vercel.app') && allowedOrigins.some((o) => o.includes('vercel.app')))) {
        return callback(null, true)
      }
      return callback(null, false)
    },
    credentials: true,
  })
)
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
