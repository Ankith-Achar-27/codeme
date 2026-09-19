import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/db.js'

const port = process.env.PORT || 5000

connectDatabase()

app.listen(port, () => {
  console.info(`CodeMe API listening on port ${port}`)
})
