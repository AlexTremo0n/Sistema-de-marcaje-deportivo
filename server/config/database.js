// server/config/database.js
// Configuración de conexión a NeonDB (PostgreSQL)

const { Pool } = require('pg');
require('dotenv').config();

// Crear pool de conexiones con configuración optimizada para NeonDB
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para NeonDB
  },
  max: 10, // Máximo de conexiones en el pool
  idleTimeoutMillis: 60000, // Tiempo de espera antes de cerrar conexión inactiva
  connectionTimeoutMillis: 10000, // Timeout de conexión aumentado a 10 segundos
  keepAlive: true, // Mantener conexiones vivas
  keepAliveInitialDelayMillis: 10000
});

// Verificar conexión al iniciar
pool.on('connect', () => {
  console.log('✅ Conectado a NeonDB PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Error en la conexión a la base de datos:', err.message);
});

// Función helper para ejecutar queries con reintentos
const query = async (text, params, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const start = Date.now();
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      console.log('📊 Query ejecutada:', { text: text.substring(0, 50) + '...', duration: duration + 'ms', rows: res.rowCount });
      return res;
    } catch (error) {
      console.error(`❌ Error en query (intento ${attempt}/${retries}):`, error.message);
      
      // Si es error de conexión y quedan reintentos, esperar y reintentar
      if (attempt < retries && (error.message.includes('timeout') || error.message.includes('terminated'))) {
        console.log(`⏳ Reintentando en 2 segundos...`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }
      throw error;
    }
  }
};

// Función para obtener un cliente del pool (para transacciones)
const getClient = async () => {
  const client = await pool.connect();
  return client;
};

// Función para "despertar" la base de datos
const wakeUp = async () => {
  try {
    console.log('🔄 Despertando base de datos NeonDB...');
    await pool.query('SELECT 1');
    console.log('✅ Base de datos activa');
    return true;
  } catch (error) {
    console.error('❌ Error al despertar BD:', error.message);
    return false;
  }
};

module.exports = {
  pool,
  query,
  getClient,
  wakeUp
};
