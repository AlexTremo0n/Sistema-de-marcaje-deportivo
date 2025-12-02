// server/routes/competencias.js
// Rutas para gestión de competencias

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/competencias - Obtener todas las competencias
router.get('/', async (req, res) => {
  try {
    const { estado, fecha } = req.query;

    let sql = `
      SELECT 
        c.*,
        u.nombre as creador_nombre,
        u.apellido as creador_apellido,
        COUNT(DISTINCT cr.id) as total_carreras
      FROM competencias c
      LEFT JOIN usuarios u ON c.id_usuario_creador = u.id
      LEFT JOIN carreras cr ON cr.id_competencia = c.id
      WHERE 1=1
    `;
    const params = [];

    if (estado) {
      params.push(estado);
      sql += ` AND c.estado = $${params.length}`;
    }

    if (fecha) {
      params.push(fecha);
      sql += ` AND c.fecha = $${params.length}`;
    }

    sql += ' GROUP BY c.id, u.nombre, u.apellido ORDER BY c.fecha DESC, c.creado_en DESC';

    const result = await query(sql, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener competencias:', error);
    res.status(500).json({ error: 'Error al obtener competencias' });
  }
});

// GET /api/competencias/:id - Obtener una competencia por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        c.*,
        u.nombre as creador_nombre,
        u.apellido as creador_apellido
      FROM competencias c
      LEFT JOIN usuarios u ON c.id_usuario_creador = u.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competencia no encontrada' });
    }

    // Obtener carreras de esta competencia
    const carreras = await query(`
      SELECT 
        cr.*,
        p.nombre as prueba_nombre,
        p.num_carriles,
        cat.nombre as categoria_nombre,
        COUNT(pa.id) as total_participantes
      FROM carreras cr
      JOIN pruebas p ON cr.id_prueba = p.id
      JOIN categorias cat ON cr.id_categoria = cat.id
      LEFT JOIN participaciones pa ON pa.id_carrera = cr.id
      WHERE cr.id_competencia = $1
      GROUP BY cr.id, p.nombre, p.num_carriles, cat.nombre
      ORDER BY cr.creado_en
    `, [id]);

    res.json({
      ...result.rows[0],
      carreras: carreras.rows
    });

  } catch (error) {
    console.error('Error al obtener competencia:', error);
    res.status(500).json({ error: 'Error al obtener competencia' });
  }
});

// POST /api/competencias - Crear nueva competencia
router.post('/', async (req, res) => {
  try {
    const { nombre, fecha, lugar, observaciones, idUsuarioCreador } = req.body;

    if (!nombre || !fecha) {
      return res.status(400).json({ error: 'Nombre y fecha son requeridos' });
    }

    const result = await query(`
      INSERT INTO competencias (nombre, fecha, lugar, observaciones, id_usuario_creador)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [nombre, fecha, lugar, observaciones, idUsuarioCreador]);

    res.status(201).json({
      success: true,
      message: 'Competencia creada exitosamente',
      competencia: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear competencia:', error);
    res.status(500).json({ error: 'Error al crear competencia' });
  }
});

// PUT /api/competencias/:id - Actualizar competencia
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, fecha, lugar, estado, observaciones } = req.body;

    const result = await query(`
      UPDATE competencias 
      SET nombre = COALESCE($1, nombre),
          fecha = COALESCE($2, fecha),
          lugar = COALESCE($3, lugar),
          estado = COALESCE($4, estado),
          observaciones = COALESCE($5, observaciones)
      WHERE id = $6
      RETURNING *
    `, [nombre, fecha, lugar, estado, observaciones, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competencia no encontrada' });
    }

    res.json({
      success: true,
      message: 'Competencia actualizada',
      competencia: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar competencia:', error);
    res.status(500).json({ error: 'Error al actualizar competencia' });
  }
});

// PUT /api/competencias/:id/estado - Cambiar estado de competencia
router.put('/:id/estado', async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const estadosValidos = ['programada', 'en_curso', 'finalizada', 'cancelada'];
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: 'Estado inválido' });
    }

    const result = await query(
      'UPDATE competencias SET estado = $1 WHERE id = $2 RETURNING *',
      [estado, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competencia no encontrada' });
    }

    res.json({
      success: true,
      message: `Estado cambiado a ${estado}`,
      competencia: result.rows[0]
    });

  } catch (error) {
    console.error('Error al cambiar estado:', error);
    res.status(500).json({ error: 'Error al cambiar estado' });
  }
});

// DELETE /api/competencias/:id - Eliminar competencia
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si tiene carreras
    const carreras = await query(
      'SELECT COUNT(*) as count FROM carreras WHERE id_competencia = $1',
      [id]
    );

    if (parseInt(carreras.rows[0].count) > 0) {
      // Soft delete - cambiar estado a cancelada
      await query(
        'UPDATE competencias SET estado = $1 WHERE id = $2',
        ['cancelada', id]
      );
      return res.json({ success: true, message: 'Competencia cancelada (tiene carreras asociadas)' });
    }

    // Hard delete si no tiene carreras
    const result = await query('DELETE FROM competencias WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Competencia no encontrada' });
    }

    res.json({ success: true, message: 'Competencia eliminada' });

  } catch (error) {
    console.error('Error al eliminar competencia:', error);
    res.status(500).json({ error: 'Error al eliminar competencia' });
  }
});

module.exports = router;
