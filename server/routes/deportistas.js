// server/routes/deportistas.js
// Rutas para gestión de deportistas

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/deportistas - Obtener todos los deportistas
router.get('/', async (req, res) => {
  try {
    const { categoria, club, activo } = req.query;
    
    let sql = `
      SELECT 
        d.id, d.rut, d.nombre, d.apellido, d.fecha_nacimiento, d.edad,
        d.genero, d.rfid_code, d.activo, d.creado_en,
        c.id as club_id, c.nombre as club_nombre,
        cat.id as categoria_id, cat.nombre as categoria_nombre
      FROM deportistas d
      LEFT JOIN clubes c ON d.id_club = c.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      WHERE 1=1
    `;
    const params = [];

    if (categoria) {
      params.push(categoria);
      sql += ` AND cat.nombre = $${params.length}`;
    }

    if (club) {
      params.push(club);
      sql += ` AND c.id = $${params.length}`;
    }

    if (activo !== undefined) {
      params.push(activo === 'true');
      sql += ` AND d.activo = $${params.length}`;
    }

    sql += ' ORDER BY d.apellido, d.nombre';

    const result = await query(sql, params);

    res.json(result.rows.map(row => ({
      id: row.id,
      rut: row.rut,
      nombre: row.nombre,
      apellido: row.apellido,
      fechaNacimiento: row.fecha_nacimiento,
      edad: row.edad,
      genero: row.genero,
      rfidCode: row.rfid_code,
      activo: row.activo,
      creadoEn: row.creado_en,
      club: row.club_id ? { id: row.club_id, nombre: row.club_nombre } : null,
      categoria: row.categoria_id ? { id: row.categoria_id, nombre: row.categoria_nombre } : null
    })));

  } catch (error) {
    console.error('Error al obtener deportistas:', error);
    res.status(500).json({ error: 'Error al obtener deportistas' });
  }
});

// GET /api/deportistas/:id - Obtener un deportista por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(`
      SELECT 
        d.*, 
        c.nombre as club_nombre,
        cat.nombre as categoria_nombre
      FROM deportistas d
      LEFT JOIN clubes c ON d.id_club = c.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deportista no encontrado' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al obtener deportista:', error);
    res.status(500).json({ error: 'Error al obtener deportista' });
  }
});

// GET /api/deportistas/rfid/:rfid - Buscar deportista por código RFID
router.get('/rfid/:rfid', async (req, res) => {
  try {
    const { rfid } = req.params;

    const result = await query(`
      SELECT 
        d.id, d.rut, d.nombre, d.apellido, d.edad, d.rfid_code,
        c.nombre as club_nombre,
        cat.nombre as categoria_nombre
      FROM deportistas d
      LEFT JOIN clubes c ON d.id_club = c.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      WHERE d.rfid_code = $1 AND d.activo = true
    `, [rfid]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deportista no encontrado con ese RFID' });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error('Error al buscar por RFID:', error);
    res.status(500).json({ error: 'Error al buscar deportista' });
  }
});

// POST /api/deportistas - Crear nuevo deportista
router.post('/', async (req, res) => {
  try {
    const { rut, nombre, apellido, fechaNacimiento, edad, genero, idClub, idCategoria, rfidCode } = req.body;

    // Validaciones
    if (!rut || !nombre || !apellido) {
      return res.status(400).json({ error: 'RUT, nombre y apellido son requeridos' });
    }

    // Verificar si el RUT ya existe
    const existeRut = await query('SELECT id FROM deportistas WHERE rut = $1', [rut]);
    if (existeRut.rows.length > 0) {
      return res.status(400).json({ error: 'Ya existe un deportista con ese RUT' });
    }

    // Verificar si el RFID ya está asignado
    if (rfidCode) {
      const existeRfid = await query('SELECT id FROM deportistas WHERE rfid_code = $1', [rfidCode]);
      if (existeRfid.rows.length > 0) {
        return res.status(400).json({ error: 'Ese código RFID ya está asignado a otro deportista' });
      }
    }

    const result = await query(`
      INSERT INTO deportistas (rut, nombre, apellido, fecha_nacimiento, edad, genero, id_club, id_categoria, rfid_code)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `, [rut, nombre, apellido, fechaNacimiento, edad, genero, idClub, idCategoria, rfidCode]);

    res.status(201).json({
      success: true,
      message: 'Deportista registrado exitosamente',
      deportista: result.rows[0]
    });

  } catch (error) {
    console.error('Error al crear deportista:', error);
    res.status(500).json({ error: 'Error al registrar deportista' });
  }
});

// PUT /api/deportistas/:id - Actualizar deportista
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, fechaNacimiento, edad, genero, idClub, idCategoria, rfidCode, activo } = req.body;

    const result = await query(`
      UPDATE deportistas 
      SET nombre = COALESCE($1, nombre),
          apellido = COALESCE($2, apellido),
          fecha_nacimiento = COALESCE($3, fecha_nacimiento),
          edad = COALESCE($4, edad),
          genero = COALESCE($5, genero),
          id_club = COALESCE($6, id_club),
          id_categoria = COALESCE($7, id_categoria),
          rfid_code = COALESCE($8, rfid_code),
          activo = COALESCE($9, activo),
          actualizado_en = NOW()
      WHERE id = $10
      RETURNING *
    `, [nombre, apellido, fechaNacimiento, edad, genero, idClub, idCategoria, rfidCode, activo, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deportista no encontrado' });
    }

    res.json({
      success: true,
      message: 'Deportista actualizado',
      deportista: result.rows[0]
    });

  } catch (error) {
    console.error('Error al actualizar deportista:', error);
    res.status(500).json({ error: 'Error al actualizar deportista' });
  }
});

// PUT /api/deportistas/:id/rfid - Asignar/Actualizar RFID
router.put('/:id/rfid', async (req, res) => {
  try {
    const { id } = req.params;
    const { rfidCode } = req.body;

    if (!rfidCode) {
      return res.status(400).json({ error: 'Código RFID es requerido' });
    }

    // Verificar si el RFID ya está asignado a otro deportista
    const existeRfid = await query(
      'SELECT id, nombre, apellido FROM deportistas WHERE rfid_code = $1 AND id != $2',
      [rfidCode, id]
    );
    
    if (existeRfid.rows.length > 0) {
      const otro = existeRfid.rows[0];
      return res.status(400).json({ 
        error: `Ese RFID ya está asignado a ${otro.nombre} ${otro.apellido}` 
      });
    }

    const result = await query(`
      UPDATE deportistas 
      SET rfid_code = $1, actualizado_en = NOW()
      WHERE id = $2
      RETURNING id, nombre, apellido, rfid_code
    `, [rfidCode, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deportista no encontrado' });
    }

    res.json({
      success: true,
      message: 'RFID asignado correctamente',
      deportista: result.rows[0]
    });

  } catch (error) {
    console.error('Error al asignar RFID:', error);
    res.status(500).json({ error: 'Error al asignar RFID' });
  }
});

// DELETE /api/deportistas/:id - Eliminar deportista (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE deportistas SET activo = false, actualizado_en = NOW() WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Deportista no encontrado' });
    }

    res.json({ success: true, message: 'Deportista desactivado' });

  } catch (error) {
    console.error('Error al eliminar deportista:', error);
    res.status(500).json({ error: 'Error al eliminar deportista' });
  }
});

module.exports = router;
