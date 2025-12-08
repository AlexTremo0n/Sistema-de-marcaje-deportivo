// server/routes/rankings.js
// Rutas para rankings generales por categoría y tipo de prueba

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/rankings/categoria/:idCategoria - Ranking general por categoría
router.get('/categoria/:idCategoria', async (req, res) => {
  try {
    const { idCategoria } = req.params;

    // Obtener información de la categoría
    const catResult = await query('SELECT * FROM categorias WHERE id = $1', [idCategoria]);
    if (catResult.rows.length === 0) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    const categoria = catResult.rows[0];

    // Ranking basado en puntos acumulados (1ro=10pts, 2do=6pts, 3ro=4pts, 4to=3pts, 5to=2pts, 6to+=1pt)
    const ranking = await query(`
      SELECT 
        d.id,
        d.nombre,
        d.apellido,
        d.rfid_code,
        cl.nombre as club_nombre,
        COUNT(DISTINCT pa.id_carrera) as carreras_participadas,
        COUNT(CASE WHEN pa.posicion = 1 THEN 1 END) as primer_lugar,
        COUNT(CASE WHEN pa.posicion = 2 THEN 1 END) as segundo_lugar,
        COUNT(CASE WHEN pa.posicion = 3 THEN 1 END) as tercer_lugar,
        SUM(
          CASE 
            WHEN pa.posicion = 1 THEN 10
            WHEN pa.posicion = 2 THEN 6
            WHEN pa.posicion = 3 THEN 4
            WHEN pa.posicion = 4 THEN 3
            WHEN pa.posicion = 5 THEN 2
            WHEN pa.posicion IS NOT NULL THEN 1
            ELSE 0
          END
        ) as puntos_totales,
        MIN(pa.tiempo_final_ms) as mejor_tiempo_ms
      FROM deportistas d
      LEFT JOIN clubes cl ON d.id_club = cl.id
      LEFT JOIN participaciones pa ON pa.id_deportista = d.id
      LEFT JOIN carreras c ON pa.id_carrera = c.id AND c.estado = 'finalizada'
      WHERE d.id_categoria = $1 AND d.activo = true
      GROUP BY d.id, d.nombre, d.apellido, d.rfid_code, cl.nombre
      ORDER BY puntos_totales DESC, primer_lugar DESC, mejor_tiempo_ms ASC NULLS LAST
    `, [idCategoria]);

    // Agregar posición en ranking
    const rankingConPosicion = ranking.rows.map((r, idx) => ({
      posicion: idx + 1,
      ...r,
      puntos_totales: parseInt(r.puntos_totales) || 0
    }));

    res.json({
      categoria: categoria,
      ranking: rankingConPosicion
    });

  } catch (error) {
    console.error('Error al obtener ranking por categoría:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// GET /api/rankings/prueba/:idPrueba - Ranking por tipo de prueba (mejores tiempos)
router.get('/prueba/:idPrueba', async (req, res) => {
  try {
    const { idPrueba } = req.params;
    const { idCategoria } = req.query; // Opcional: filtrar por categoría

    // Obtener información de la prueba
    const pruebaResult = await query('SELECT * FROM pruebas WHERE id = $1', [idPrueba]);
    if (pruebaResult.rows.length === 0) {
      return res.status(404).json({ error: 'Prueba no encontrada' });
    }
    const prueba = pruebaResult.rows[0];

    // Ranking de mejores tiempos en esta prueba
    let sql = `
      SELECT 
        d.id,
        d.nombre,
        d.apellido,
        d.rfid_code,
        cl.nombre as club_nombre,
        cat.nombre as categoria_nombre,
        MIN(pa.tiempo_final_ms) as mejor_tiempo_ms,
        COUNT(DISTINCT pa.id_carrera) as veces_participado,
        AVG(pa.tiempo_final_ms)::INTEGER as tiempo_promedio_ms
      FROM participaciones pa
      JOIN carreras c ON pa.id_carrera = c.id
      JOIN deportistas d ON pa.id_deportista = d.id
      LEFT JOIN clubes cl ON d.id_club = cl.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      WHERE c.id_prueba = $1 
        AND c.estado = 'finalizada' 
        AND pa.tiempo_final_ms IS NOT NULL
        AND d.activo = true
    `;
    const params = [idPrueba];

    if (idCategoria) {
      params.push(idCategoria);
      sql += ` AND d.id_categoria = $${params.length}`;
    }

    sql += `
      GROUP BY d.id, d.nombre, d.apellido, d.rfid_code, cl.nombre, cat.nombre
      ORDER BY mejor_tiempo_ms ASC
    `;

    const ranking = await query(sql, params);

    // Agregar posición
    const rankingConPosicion = ranking.rows.map((r, idx) => ({
      posicion: idx + 1,
      ...r
    }));

    res.json({
      prueba: prueba,
      ranking: rankingConPosicion
    });

  } catch (error) {
    console.error('Error al obtener ranking por prueba:', error);
    res.status(500).json({ error: 'Error al obtener ranking' });
  }
});

// GET /api/rankings/general - Ranking general de todos los deportistas
router.get('/general', async (req, res) => {
  try {
    const ranking = await query(`
      SELECT 
        d.id,
        d.nombre,
        d.apellido,
        d.rfid_code,
        cl.nombre as club_nombre,
        cat.nombre as categoria_nombre,
        COUNT(DISTINCT pa.id_carrera) as carreras_participadas,
        COUNT(CASE WHEN pa.posicion = 1 THEN 1 END) as primer_lugar,
        COUNT(CASE WHEN pa.posicion = 2 THEN 1 END) as segundo_lugar,
        COUNT(CASE WHEN pa.posicion = 3 THEN 1 END) as tercer_lugar,
        SUM(
          CASE 
            WHEN pa.posicion = 1 THEN 10
            WHEN pa.posicion = 2 THEN 6
            WHEN pa.posicion = 3 THEN 4
            WHEN pa.posicion = 4 THEN 3
            WHEN pa.posicion = 5 THEN 2
            WHEN pa.posicion IS NOT NULL THEN 1
            ELSE 0
          END
        ) as puntos_totales
      FROM deportistas d
      LEFT JOIN clubes cl ON d.id_club = cl.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      LEFT JOIN participaciones pa ON pa.id_deportista = d.id
      LEFT JOIN carreras c ON pa.id_carrera = c.id AND c.estado = 'finalizada'
      WHERE d.activo = true
      GROUP BY d.id, d.nombre, d.apellido, d.rfid_code, cl.nombre, cat.nombre
      HAVING COUNT(DISTINCT pa.id_carrera) > 0
      ORDER BY puntos_totales DESC, primer_lugar DESC
    `);

    const rankingConPosicion = ranking.rows.map((r, idx) => ({
      posicion: idx + 1,
      ...r,
      puntos_totales: parseInt(r.puntos_totales) || 0
    }));

    res.json(rankingConPosicion);

  } catch (error) {
    console.error('Error al obtener ranking general:', error);
    res.status(500).json({ error: 'Error al obtener ranking general' });
  }
});

// GET /api/rankings/clubes - Ranking de clubes por puntos acumulados
router.get('/clubes', async (req, res) => {
  try {
    const ranking = await query(`
      SELECT 
        cl.id,
        cl.nombre,
        cl.codigo,
        COUNT(DISTINCT d.id) as total_deportistas,
        COUNT(DISTINCT pa.id_carrera) as total_participaciones,
        COUNT(CASE WHEN pa.posicion = 1 THEN 1 END) as medallas_oro,
        COUNT(CASE WHEN pa.posicion = 2 THEN 1 END) as medallas_plata,
        COUNT(CASE WHEN pa.posicion = 3 THEN 1 END) as medallas_bronce,
        SUM(
          CASE 
            WHEN pa.posicion = 1 THEN 10
            WHEN pa.posicion = 2 THEN 6
            WHEN pa.posicion = 3 THEN 4
            WHEN pa.posicion = 4 THEN 3
            WHEN pa.posicion = 5 THEN 2
            WHEN pa.posicion IS NOT NULL THEN 1
            ELSE 0
          END
        ) as puntos_totales
      FROM clubes cl
      LEFT JOIN deportistas d ON d.id_club = cl.id AND d.activo = true
      LEFT JOIN participaciones pa ON pa.id_deportista = d.id
      LEFT JOIN carreras c ON pa.id_carrera = c.id AND c.estado = 'finalizada'
      WHERE cl.activo = true
      GROUP BY cl.id, cl.nombre, cl.codigo
      ORDER BY puntos_totales DESC, medallas_oro DESC
    `);

    const rankingConPosicion = ranking.rows.map((r, idx) => ({
      posicion: idx + 1,
      ...r,
      puntos_totales: parseInt(r.puntos_totales) || 0
    }));

    res.json(rankingConPosicion);

  } catch (error) {
    console.error('Error al obtener ranking de clubes:', error);
    res.status(500).json({ error: 'Error al obtener ranking de clubes' });
  }
});

// GET /api/rankings/records - Mejores tiempos históricos por prueba y categoría
router.get('/records', async (req, res) => {
  try {
    const records = await query(`
      SELECT DISTINCT ON (c.id_prueba, d.id_categoria)
        p.nombre as prueba_nombre,
        p.distancia_metros,
        cat.nombre as categoria_nombre,
        d.nombre as deportista_nombre,
        d.apellido as deportista_apellido,
        cl.nombre as club_nombre,
        pa.tiempo_final_ms as tiempo_record,
        c.finalizado_en as fecha_record
      FROM participaciones pa
      JOIN carreras c ON pa.id_carrera = c.id
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN deportistas d ON pa.id_deportista = d.id
      LEFT JOIN categorias cat ON d.id_categoria = cat.id
      LEFT JOIN clubes cl ON d.id_club = cl.id
      WHERE c.estado = 'finalizada' 
        AND pa.tiempo_final_ms IS NOT NULL
      ORDER BY c.id_prueba, d.id_categoria, pa.tiempo_final_ms ASC
    `);

    res.json(records.rows);

  } catch (error) {
    console.error('Error al obtener records:', error);
    res.status(500).json({ error: 'Error al obtener records' });
  }
});

module.exports = router;
