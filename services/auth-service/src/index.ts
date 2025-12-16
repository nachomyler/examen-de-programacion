import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
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
app.use('/', authRoutes)

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'auth-service',
    timestamp: new Date().toISOString()
  })
})

app.listen(PORT, () => {
  console.log(`🔐 Auth Service running on http://localhost:${PORT}`)
})



