import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import flightsRoutes from './routes/flights.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3002
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

// Health check (must be before routes)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'flights-service',
    timestamp: new Date().toISOString()
  })
})

// Routes
app.use('/', flightsRoutes)

app.listen(PORT, () => {
  console.log(`✈️ Flights Service running on http://localhost:${PORT}`)
})



