// Script para iniciar el servidor con detección automática de puerto ocupado
const { spawn } = require('child_process');
const { execSync } = require('child_process');
const os = require('os');

const port = process.env.PORT || 3001;

function killPort(port) {
  const platform = os.platform();
  let foundProcesses = false;
  
  try {
    if (platform === 'win32') {
      // Windows
      try {
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const lines = result.trim().split('\n').filter(line => line.trim());
        const pids = new Set();
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) {
            pids.add(match[1]);
          }
        });
        
        if (pids.size > 0) {
          foundProcesses = true;
          console.log(`🔍 Encontrados ${pids.size} proceso(s) en el puerto ${port}`);
          
          pids.forEach(pid => {
            try {
              console.log(`🛑 Deteniendo proceso (PID: ${pid})...`);
              execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore', timeout: 5000 });
            } catch (err) {
              // Proceso ya terminado o sin permisos
            }
          });
          
          console.log(`✅ Procesos detenidos. Esperando 2 segundos para liberar el puerto...`);
          // Esperar un poco más para que el puerto se libere completamente
          const start = Date.now();
          while (Date.now() - start < 2000) {
            // Esperar 2 segundos
          }
        }
      } catch (err) {
        // No hay procesos en el puerto o error al buscar
      }
    } else {
      // Linux/Mac
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'ignore'] });
        const pids = result.trim().split('\n').filter(pid => pid && pid.trim());
        
        if (pids.length > 0) {
          foundProcesses = true;
          console.log(`🔍 Encontrados ${pids.length} proceso(s) en el puerto ${port}`);
          
          pids.forEach(pid => {
            try {
              console.log(`🛑 Deteniendo proceso (PID: ${pid})...`);
              execSync(`kill -9 ${pid}`, { stdio: 'ignore', timeout: 5000 });
            } catch (err) {
              // Proceso ya terminado
            }
          });
          
          console.log(`✅ Procesos detenidos. Esperando 2 segundos para liberar el puerto...`);
          const start = Date.now();
          while (Date.now() - start < 2000) {
            // Esperar 2 segundos
          }
        }
      } catch (err) {
        // No hay procesos en el puerto, continuar
      }
    }
    
    if (!foundProcesses) {
      console.log(`ℹ️  Puerto ${port} está libre`);
    }
  } catch (err) {
    // Error general, pero continuamos
    console.log(`⚠️  No se pudo verificar el puerto ${port}, continuando...`);
  }
}

// Detener procesos en el puerto
console.log(`🔧 Verificando puerto ${port}...`);
killPort(port);
console.log(`✅ Iniciando servidor...\n`);

// Iniciar el servidor usando el bin de tsx directamente
const path = require('path');
const tsxBinPath = path.join(__dirname, 'node_modules', 'tsx', 'dist', 'cli.mjs');

// Verificar que existe
const fs = require('fs');
if (!fs.existsSync(tsxBinPath)) {
  console.error(`❌ Error: No se encontró tsx en ${tsxBinPath}`);
  console.error(`   Ejecuta: npm install`);
  process.exit(1);
}

const server = spawn('node', [tsxBinPath, 'watch', 'src/index.ts'], {
  stdio: 'inherit',
  shell: false,
  cwd: __dirname
});

server.on('error', (err) => {
  console.error('❌ Error al iniciar el servidor:', err);
  process.exit(1);
});

server.on('exit', (code) => {
  process.exit(code || 0);
});

// Manejar Ctrl+C
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor...');
  server.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill('SIGTERM');
  process.exit(0);
});

