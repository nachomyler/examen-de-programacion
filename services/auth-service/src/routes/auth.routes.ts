import express, { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/User'

const router = express.Router()

// Register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name, role } = req.body

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      name,
      role: role || 'USUARIO'
    })

    // Generate token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    const userObj = user.toJSON()
    res.status(201).json({
      token,
      user: userObj
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

// Login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()

    // Find user
    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Check password
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id.toString(), email: user.email, role: user.role },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    )

    const userObj = user.toJSON()
    res.json({
      token,
      user: userObj
    })
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
})

export default router



