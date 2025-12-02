// server/routes/catalogos.js
// Rutas para catálogos del sistema (clubes, categorías, pruebas)

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// ============================================
// CLUBES
// ============================================

// GET /api/catalogos/clubes
router.get('/clubes', async (req, res) => {
  try {
    const result = await query(`
      SELECT c.*, COUNT(d.id) as total_deportistas
      FROM clubes c
      LEFT JOIN deportistas d ON d.id_club = c.id AND d.activo = true
      WHERE c.activo = true
      GROUP BY c.id
      ORDER BY c.nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener clubes:', error);
    res.status(500).json({ error: 'Error al obtener clubes' });
  }
});

// POST /api/catalogos/clubes
router.post('/clubes', async (req, res) => {
  try {
    const { nombre, ciudad, direccion, telefono, email } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const result = await query(`
      INSERT INTO clubes (nombre, ciudad, direccion, telefono, email)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, ciudad, direccion, telefono, email]);

    res.status(201).json({
      success: true,
      club: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear club:', error);
    res.status(500).json({ error: 'Error al crear club' });
  }
});

// ============================================
// CATEGORÍAS
// ============================================

// GET /api/catalogos/categorias
router.get('/categorias', async (req, res) => {
  try {
    const result = await query(`
      SELECT cat.*, COUNT(d.id) as total_deportistas
      FROM categorias cat
      LEFT JOIN deportistas d ON d.id_categoria = cat.id AND d.activo = true
      GROUP BY cat.id
      ORDER BY cat.edad_minima
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener categorías:', error);
    res.status(500).json({ error: 'Error al obtener categorías' });
  }
});

// POST /api/catalogos/categorias
router.post('/categorias', async (req, res) => {
  try {
    const { nombre, edadMinima, edadMaxima, descripcion } = req.body;

    if (!nombre) {
      return res.status(400).json({ error: 'Nombre es requerido' });
    }

    const result = await query(`
      INSERT INTO categorias (nombre, edad_minima, edad_maxima, descripcion)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [nombre, edadMinima, edadMaxima, descripcion]);

    res.status(201).json({
      success: true,
      categoria: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear categoría:', error);
    res.status(500).json({ error: 'Error al crear categoría' });
  }
});

// ============================================
// PRUEBAS
// ============================================

// GET /api/catalogos/pruebas
router.get('/pruebas', async (req, res) => {
  try {
    const result = await query(`
      SELECT * FROM pruebas
      WHERE activo = true
      ORDER BY distancia_metros, nombre
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pruebas:', error);
    res.status(500).json({ error: 'Error al obtener pruebas' });
  }
});

// POST /api/catalogos/pruebas
router.post('/pruebas', async (req, res) => {
  try {
    const { codigo, nombre, distanciaMetros, numCarriles, descripcion } = req.body;

    if (!codigo || !nombre) {
      return res.status(400).json({ error: 'Código y nombre son requeridos' });
    }

    const result = await query(`
      INSERT INTO pruebas (codigo, nombre, distancia_metros, num_carriles, descripcion)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [codigo, nombre, distanciaMetros, numCarriles || 8, descripcion]);

    res.status(201).json({
      success: true,
      prueba: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear prueba:', error);
    res.status(500).json({ error: 'Error al crear prueba' });
  }
});

// ============================================
// ESTADÍSTICAS GENERALES
// ============================================

// GET /api/catalogos/estadisticas
router.get('/estadisticas', async (req, res) => {
  try {
    const deportistas = await query('SELECT COUNT(*) as total FROM deportistas WHERE activo = true');
    const clubes = await query('SELECT COUNT(*) as total FROM clubes WHERE activo = true');
    const competencias = await query('SELECT COUNT(*) as total FROM competencias');
    const carreras = await query('SELECT COUNT(*) as total FROM carreras WHERE estado = $1', ['finalizada']);

    res.json({
      totalDeportistas: parseInt(deportistas.rows[0].total),
      totalClubes: parseInt(clubes.rows[0].total),
      totalCompetencias: parseInt(competencias.rows[0].total),
      totalCarrerasFinalizadas: parseInt(carreras.rows[0].total)
    });

  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});

module.exports = router;
