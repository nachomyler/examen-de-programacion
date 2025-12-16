import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/User'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/skytrack'

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI)
    console.log('Connected to MongoDB')

    // Clear existing users
    await User.deleteMany({})

    // Create users
    const adminPassword = await bcrypt.hash('admin123', 10)
    const operatorPassword = await bcrypt.hash('operador123', 10)
    const userPassword = await bcrypt.hash('usuario123', 10)

    const admin = await User.create({
      email: 'admin@skytrack.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN'
    })

    const operator = await User.create({
      email: 'operador@skytrack.com',
      password: operatorPassword,
      name: 'Operador',
      role: 'OPERADOR'
    })

    const user = await User.create({
      email: 'usuario@skytrack.com',
      password: userPassword,
      name: 'Usuario',
      role: 'USUARIO'
    })

    console.log('✅ Seed data created:')
    console.log(`   Admin: ${admin.email}`)
    console.log(`   Operator: ${operator.email}`)
    console.log(`   User: ${user.email}`)

    await mongoose.disconnect()
  } catch (error) {
    console.error('Error seeding:', error)
    process.exit(1)
  }
}

seed()



