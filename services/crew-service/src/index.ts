import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import crewRoutes from './routes/crew.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3004
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skytrack'

// Middleware
app.use(cors())
app.use(express.json())

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB')
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error)
    process.exit(1)
  })

// Routes
app.use('/', crewRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'crew-service',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`👥 Crew Service running on http://localhost:${PORT}`)
})








