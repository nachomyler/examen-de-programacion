import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Plane from './models/Plane'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skytrack'

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing planes
    await Plane.deleteMany({})

    // Create planes
    const plane1 = await Plane.create({
      code: 'SKY001',
      modelName: 'Boeing 737',
      capacity: 150,
      status: 'DISPONIBLE'
    })

    const plane2 = await Plane.create({
      code: 'SKY002',
      modelName: 'Airbus A320',
      capacity: 180,
      status: 'DISPONIBLE'
    })

    const plane3 = await Plane.create({
      code: 'SKY003',
      modelName: 'Boeing 777',
      capacity: 300,
      status: 'DISPONIBLE'
    })

    console.log('✅ Seed data created:')
    console.log(`   Plane 1: ${plane1.code} - ${plane1.modelName}`)
    console.log(`   Plane 2: ${plane2.code} - ${plane2.modelName}`)
    console.log(`   Plane 3: ${plane3.code} - ${plane3.modelName}`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error seeding:', error)
    process.exit(1)
  }
}

seed()

