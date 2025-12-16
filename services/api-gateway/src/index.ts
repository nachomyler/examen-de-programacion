import express from 'express'
import { createProxyMiddleware } from 'http-proxy-middleware'
import cors from 'cors'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())

// Service URLs
const AUTH_SERVICE = process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
const FLIGHTS_SERVICE = process.env.FLIGHTS_SERVICE_URL || 'http://localhost:3002'
const PLANES_SERVICE = process.env.PLANES_SERVICE_URL || 'http://localhost:3003'
const CREW_SERVICE = process.env.CREW_SERVICE_URL || 'http://localhost:3004'
const DASHBOARD_SERVICE = process.env.DASHBOARD_SERVICE_URL || 'http://localhost:3005'

// Proxy middleware for each service
app.use('/api/auth', createProxyMiddleware({
  target: AUTH_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': ''
  },
  timeout: 30000,
  proxyTimeout: 30000,
  onError: (err, req, res) => {
    console.error('[API Gateway Proxy Error]', err.message)
    if (!res.headersSent) {
      res.status(500).json({ error: 'Proxy error', message: err.message })
    }
  }
}))

app.use('/api/flights', createProxyMiddleware({
  target: FLIGHTS_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/flights': ''
  }
}))

app.use('/api/planes', createProxyMiddleware({
  target: PLANES_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/planes': ''
  }
}))

app.use('/api/crew', createProxyMiddleware({
  target: CREW_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/crew': ''
  }
}))

app.use('/api/dashboard', createProxyMiddleware({
  target: DASHBOARD_SERVICE,
  changeOrigin: true,
  pathRewrite: {
    '^/api/dashboard': ''
  }
}))

// Health check
app.get('/api/health', (req: express.Request, res: express.Response) => {
  res.json({
    status: 'ok',
    message: 'SkyTrack API Gateway is running',
    services: {
      auth: AUTH_SERVICE,
      flights: FLIGHTS_SERVICE,
      planes: PLANES_SERVICE,
      crew: CREW_SERVICE,
      dashboard: DASHBOARD_SERVICE
    },
    timestamp: new Date().toISOString()
  })
})

// Root endpoint
app.get('/', (req: express.Request, res: express.Response) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkyTrack Airlines - API Gateway</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
          color: #fff;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container {
          max-width: 800px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }
        h1 { font-size: 3rem; margin-bottom: 10px; text-align: center; }
        .subtitle { text-align: center; font-size: 1.2rem; margin-bottom: 30px; opacity: 0.9; }
        .services {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          padding: 20px;
          margin-top: 20px;
        }
        .service {
          padding: 10px;
          margin: 10px 0;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 5px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✈️ SkyTrack Airlines</h1>
        <p class="subtitle">API Gateway - Arquitectura de Microservicios</p>
        <div class="services">
          <h2>Microservicios Activos</h2>
          <div class="service">🔐 Auth Service: ${AUTH_SERVICE}</div>
          <div class="service">✈️ Flights Service: ${FLIGHTS_SERVICE}</div>
          <div class="service">🛩️ Planes Service: ${PLANES_SERVICE}</div>
          <div class="service">👥 Crew Service: ${CREW_SERVICE}</div>
          <div class="service">📊 Dashboard Service: ${DASHBOARD_SERVICE}</div>
        </div>
        <div style="margin-top: 30px; text-align: center;">
          <a href="/api/health" style="color: #93c5fd; text-decoration: none;">🔍 Health Check</a>
        </div>
      </div>
    </body>
    </html>
  `)
})

app.listen(PORT, () => {
  console.log(`🚀 API Gateway running on http://localhost:${PORT}`)
  console.log(`📡 Routing to services:`)
  console.log(`   Auth: ${AUTH_SERVICE}`)
  console.log(`   Flights: ${FLIGHTS_SERVICE}`)
  console.log(`   Planes: ${PLANES_SERVICE}`)
  console.log(`   Crew: ${CREW_SERVICE}`)
  console.log(`   Dashboard: ${DASHBOARD_SERVICE}`)
})

