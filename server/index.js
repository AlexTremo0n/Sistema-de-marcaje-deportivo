// server/index.js
// Servidor principal del Sistema de Marcaje Deportivo

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { pool, wakeUp } = require('./config/database');

// Importar rutas
const authRoutes = require('./routes/auth');
const deportistasRoutes = require('./routes/deportistas');
const competenciasRoutes = require('./routes/competencias');
const carrerasRoutes = require('./routes/carreras');
const eventosRoutes = require('./routes/eventos');
const catalogosRoutes = require('./routes/catalogos');

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Logging de requests
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/deportistas', deportistasRoutes);
app.use('/api/competencias', competenciasRoutes);
app.use('/api/carreras', carrerasRoutes);
app.use('/api/eventos', eventosRoutes);
app.use('/api/catalogos', catalogosRoutes);

// Ruta de prueba de conexión
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok', 
      database: 'connected',
      timestamp: result.rows[0].now 
    });
  } catch (error) {
    res.status(500).json({ 
      status: 'error', 
      database: 'disconnected',
      error: error.message 
    });
  }
});

// Servir frontend en producción
if (process.env.NODE_ENV === 'production') {
  // Servir archivos estáticos del build de React
  app.use(express.static(path.join(__dirname, '../build')));
  
  // Cualquier ruta que NO sea API, devolver el index.html
  app.get('*', (req, res, next) => {
    // Si es una ruta de API, pasar al siguiente handler (404)
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
  });
}

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Iniciar servidor
const startServer = async () => {
  console.log('🔄 Iniciando servidor...');
  
  // Despertar la base de datos antes de aceptar conexiones
  await wakeUp();
  
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`📡 API disponible en /api`);
    console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
