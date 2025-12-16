import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  user?: {
    id: string
    email: string
    role: string
  }
}

/**
 * Middleware para autenticar requests usando JWT
 * Extrae el token del header Authorization y valida el JWT
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return res.status(401).json({ error: 'Invalid token format. Use: Bearer <token>' })
    }

    const token = parts[1]
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    // Verify token
    const jwtSecret = process.env.JWT_SECRET || 'secret'
    const decoded = jwt.verify(token, jwtSecret) as any

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' })
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' })
    }
    return res.status(401).json({ error: 'Authentication failed' })
  }
}

/**
 * Middleware para requerir roles específicos
 * Debe usarse después de authenticate
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Insufficient permissions',
        message: `This action requires one of the following roles: ${allowedRoles.join(', ')}`
      })
    }

    next()
  }
}

/**
 * Middleware opcional para autenticación (no falla si no hay token)
 * Útil para rutas que tienen funcionalidad diferente si el usuario está autenticado
 */
export const optionalAuthenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) {
      return next()
    }

    const parts = authHeader.split(' ')
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return next()
    }

    const token = parts[1]
    if (!token) {
      return next()
    }

    const jwtSecret = process.env.JWT_SECRET || 'secret'
    const decoded = jwt.verify(token, jwtSecret) as any

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role
    }

    next()
  } catch (error) {
    // Si el token es inválido, continuar sin autenticación
    next()
  }
}

