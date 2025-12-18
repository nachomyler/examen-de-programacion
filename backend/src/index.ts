import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import flightRoutes from './routes/flight.routes';
import planeRoutes from './routes/plane.routes';
import crewRoutes from './routes/crew.routes';
import authRoutes from './routes/auth.routes';
import dashboardRoutes from './routes/dashboard.routes';
import userFlightRoutes from './routes/userFlight.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Welcome page at root
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>SkyTrack Airlines API</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
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
        h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
        }
        .subtitle {
          font-size: 1.2em;
          opacity: 0.9;
          margin-bottom: 30px;
        }
        .status {
          background: rgba(16, 185, 129, 0.2);
          padding: 15px;
          border-radius: 10px;
          margin-bottom: 30px;
          border: 1px solid rgba(16, 185, 129, 0.5);
        }
        .endpoints {
          margin-top: 30px;
        }
        .endpoint-group {
          margin-bottom: 20px;
        }
        .endpoint-group h3 {
          font-size: 1.3em;
          margin-bottom: 10px;
          color: #93c5fd;
        }
        .endpoint {
          background: rgba(0, 0, 0, 0.2);
          padding: 10px;
          border-radius: 5px;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
          font-size: 0.9rem;
        }
        .method {
          display: inline-block;
          padding: 2px 8px;
          border-radius: 4px;
          font-weight: bold;
          margin-right: 10px;
          font-size: 0.8rem;
        }
        .get { background: #10b981; }
        .post { background: #3b82f6; }
        .put { background: #f59e0b; }
        .delete { background: #ef4444; }
        .links {
          margin-top: 30px;
          text-align: center;
        }
        .links a {
          color: #93c5fd;
          text-decoration: none;
          margin: 0 15px;
          font-size: 1.1rem;
        }
        .links a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>✈️ SkyTrack Airlines</h1>
        <p class="subtitle">API REST - Sistema de Gestión de Vuelos</p>
        <div class="status">
          <strong>✅ Servidor en línea</strong> - API funcionando correctamente
        </div>
        <div class="endpoints">
          <div class="endpoint-group">
            <h3>🔐 Autenticación</h3>
            <div class="endpoint"><span class="method post">POST</span>/api/auth/login</div>
            <div class="endpoint"><span class="method post">POST</span>/api/auth/register</div>
          </div>
          <div class="endpoint-group">
            <h3>✈️ Vuelos</h3>
            <div class="endpoint"><span class="method get">GET</span>/api/flights</div>
            <div class="endpoint"><span class="method get">GET</span>/api/flights/:id</div>
            <div class="endpoint"><span class="method post">POST</span>/api/flights</div>
            <div class="endpoint"><span class="method put">PUT</span>/api/flights/:id</div>
            <div class="endpoint"><span class="method delete">DELETE</span>/api/flights/:id</div>
          </div>
          <div class="endpoint-group">
            <h3>🛫 Aviones</h3>
            <div class="endpoint"><span class="method get">GET</span>/api/planes</div>
            <div class="endpoint"><span class="method post">POST</span>/api/planes</div>
            <div class="endpoint"><span class="method put">PUT</span>/api/planes/:id</div>
          </div>
          <div class="endpoint-group">
            <h3>👥 Tripulación</h3>
            <div class="endpoint"><span class="method get">GET</span>/api/crew/flight/:flightId</div>
            <div class="endpoint"><span class="method post">POST</span>/api/crew/flight/:flightId</div>
            <div class="endpoint"><span class="method delete">DELETE</span>/api/crew/:id</div>
          </div>
          <div class="endpoint-group">
            <h3>📊 Dashboard</h3>
            <div class="endpoint"><span class="method get">GET</span>/api/dashboard</div>
            <div class="endpoint"><span class="method get">GET</span>/api/dashboard/active</div>
            <div class="endpoint"><span class="method get">GET</span>/api/dashboard/next</div>
            <div class="endpoint"><span class="method put">PUT</span>/api/dashboard/flight/:id/status</div>
          </div>
          <div class="endpoint-group">
            <h3>🎫 Usuario-Vuelo</h3>
            <div class="endpoint"><span class="method post">POST</span>/api/user-flights/flight/:flightId/take</div>
            <div class="endpoint"><span class="method delete">DELETE</span>/api/user-flights/flight/:flightId/release</div>
            <div class="endpoint"><span class="method get">GET</span>/api/user-flights/my-flights</div>
            <div class="endpoint"><span class="method get">GET</span>/api/user-flights/flight/:flightId/check</div>
          </div>
        </div>
        <div class="links">
          <a href="/api/health">🔍 Health Check</a>
          <a href="http://localhost:3000" target="_blank">🌐 Frontend</a>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/planes', planeRoutes);
app.use('/api/crew', crewRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/user-flights', userFlightRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'SkyTrack Airlines API'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});







