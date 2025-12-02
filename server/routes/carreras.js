// server/routes/carreras.js
// Rutas para gestión de carreras y participaciones

const express = require('express');
const router = express.Router();
const { query, getClient } = require('../config/database');

// GET /api/carreras - Obtener carreras (con filtros)
router.get('/', async (req, res) => {
  try {
    const { competencia, estado, prueba, categoria } = req.query;

    let sql = `
      SELECT 
        c.*,
        p.nombre as prueba_nombre,
        p.codigo as prueba_codigo,
        p.num_carriles,
        p.distancia_metros,
        cat.nombre as categoria_nombre,
        comp.nombre as competencia_nombre,
        comp.fecha as competencia_fecha
      FROM carreras c
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN categorias cat ON c.id_categoria = cat.id
      JOIN competencias comp ON c.id_competencia = comp.id
      WHERE 1=1
    `;
    const params = [];

    if (competencia) {
      params.push(competencia);
      sql += ` AND c.id_competencia = $${params.length}`;
    }

    if (estado) {
      params.push(estado);
      sql += ` AND c.estado = $${params.length}`;
    }

    if (prueba) {
      params.push(prueba);
      sql += ` AND c.id_prueba = $${params.length}`;
    }

    if (categoria) {
      params.push(categoria);
      sql += ` AND c.id_categoria = $${params.length}`;
    }

    sql += ' ORDER BY c.creado_en DESC';

    const result = await query(sql, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener carreras:', error);
    res.status(500).json({ error: 'Error al obtener carreras' });
  }
});

// GET /api/carreras/activa - Obtener la carrera activa actual
router.get('/activa', async (req, res) => {
  try {
    const result = await query(`
      SELECT 
        c.*,
        p.nombre as prueba_nombre,
        p.num_carriles,
        cat.nombre as categoria_nombre
      FROM carreras c
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN categorias cat ON c.id_categoria = cat.id
      WHERE c.estado IN ('asignando', 'lista', 'en_curso')
      ORDER BY c.creado_en DESC
      LIMIT 1
    `);

    if (result.rows.length === 0) {
      return res.json({ carrera: null });
    }

    const carrera = result.rows[0];

    // Obtener participaciones
    const participaciones = await query(`
      SELECT 
        pa.*,
        d.nombre as deportista_nombre,
        d.apellido as deportista_apellido,
        d.rfid_code,
        cl.nombre as club_nombre
      FROM participaciones pa
      JOIN deportistas d ON pa.id_deportista = d.id
      LEFT JOIN clubes cl ON d.id_club = cl.id
      WHERE pa.id_carrera = $1
      ORDER BY pa.carril
    `, [carrera.id]);

    res.json({
      carrera: {
        ...carrera,
        participaciones: participaciones.rows
      }
    });

  } catch (error) {
    console.error('Error al obtener carrera activa:', error);
    res.status(500).json({ error: 'Error al obtener carrera activa' });
  }
});

// GET /api/carreras/historial/resultados - Obtener historial de resultados
router.get('/historial/resultados', async (req, res) => {
  try {
    // Obtener carreras finalizadas con sus datos
    const carreras = await query(`
      SELECT 
        c.id,
        c.finalizado_en as fecha,
        p.nombre as prueba_nombre,
        cat.nombre as categoria_nombre,
        comp.nombre as competencia_nombre
      FROM carreras c
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN categorias cat ON c.id_categoria = cat.id
      JOIN competencias comp ON c.id_competencia = comp.id
      WHERE c.estado = 'finalizada'
      ORDER BY c.finalizado_en DESC
    `);

    // Para cada carrera, obtener sus resultados
    const historial = [];
    for (const carrera of carreras.rows) {
      const resultados = await query(`
        SELECT 
          ro.posicion,
          ro.tiempo_oficial_ms as tiempo,
          ro.tiempo_formato,
          d.nombre as deportista_nombre,
          d.apellido as deportista_apellido,
          d.rfid_code,
          cl.nombre as club_nombre,
          pa.carril
        FROM resultados_oficiales ro
        JOIN deportistas d ON ro.id_deportista = d.id
        LEFT JOIN clubes cl ON ro.id_club = cl.id
        LEFT JOIN participaciones pa ON pa.id_carrera = ro.id_carrera AND pa.id_deportista = ro.id_deportista
        WHERE ro.id_carrera = $1
        ORDER BY ro.posicion
      `, [carrera.id]);

      if (resultados.rows.length > 0) {
        historial.push({
          id: carrera.id,
          prueba: carrera.prueba_nombre,
          categoria: carrera.categoria_nombre,
          competencia: carrera.competencia_nombre,
          fecha: carrera.fecha ? new Date(carrera.fecha).toLocaleDateString() : 'N/A',
          resultados: resultados.rows.map(r => ({
            posicion: r.posicion,
            deportista: {
              nombre: r.deportista_nombre,
              apellido: r.deportista_apellido,
              club: r.club_nombre,
              rfid: r.rfid_code
            },
            carril: r.carril,
            tiempo: r.tiempo
          }))
        });
      }
    }

    res.json(historial);

  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

// GET /api/carreras/:id - Obtener una carrera por ID con sus participaciones
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const carreraResult = await query(`
      SELECT 
        c.*,
        p.nombre as prueba_nombre,
        p.num_carriles,
        p.distancia_metros,
        cat.nombre as categoria_nombre,
        comp.nombre as competencia_nombre
      FROM carreras c
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN categorias cat ON c.id_categoria = cat.id
      JOIN competencias comp ON c.id_competencia = comp.id
      WHERE c.id = $1
    `, [id]);

    if (carreraResult.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    const carrera = carreraResult.rows[0];

    // Obtener participaciones
    const participaciones = await query(`
      SELECT 
        pa.*,
        d.id as deportista_id,
        d.nombre as deportista_nombre,
        d.apellido as deportista_apellido,
        d.rfid_code,
        d.rut,
        cl.nombre as club_nombre
      FROM participaciones pa
      JOIN deportistas d ON pa.id_deportista = d.id
      LEFT JOIN clubes cl ON d.id_club = cl.id
      WHERE pa.id_carrera = $1
      ORDER BY pa.carril
    `, [id]);

    res.json({
      ...carrera,
      participaciones: participaciones.rows
    });

  } catch (error) {
    console.error('Error al obtener carrera:', error);
    res.status(500).json({ error: 'Error al obtener carrera' });
  }
});

// POST /api/carreras - Crear nueva carrera
router.post('/', async (req, res) => {
  try {
    const { idCompetencia, idPrueba, idCategoria, numeroSerie } = req.body;

    if (!idCompetencia || !idPrueba || !idCategoria) {
      return res.status(400).json({ error: 'Competencia, prueba y categoría son requeridos' });
    }

    const result = await query(`
      INSERT INTO carreras (id_competencia, id_prueba, id_categoria, numero_serie, estado)
      VALUES ($1, $2, $3, $4, 'asignando')
      RETURNING *
    `, [idCompetencia, idPrueba, idCategoria, numeroSerie || 1]);

    // Obtener datos completos
    const carreraCompleta = await query(`
      SELECT 
        c.*,
        p.nombre as prueba_nombre,
        p.num_carriles,
        cat.nombre as categoria_nombre
      FROM carreras c
      JOIN pruebas p ON c.id_prueba = p.id
      JOIN categorias cat ON c.id_categoria = cat.id
      WHERE c.id = $1
    `, [result.rows[0].id]);

    res.status(201).json({
      success: true,
      message: 'Carrera creada',
      carrera: carreraCompleta.rows[0]
    });

  } catch (error) {
    console.error('Error al crear carrera:', error);
    res.status(500).json({ error: 'Error al crear carrera' });
  }
});

// POST /api/carreras/:id/asignar-carril - Asignar deportista a carril por RFID
router.post('/:id/asignar-carril', async (req, res) => {
  try {
    const { id } = req.params;
    const { rfidCode, carril } = req.body;

    // Buscar deportista por RFID
    const deportista = await query(
      'SELECT id, nombre, apellido FROM deportistas WHERE rfid_code = $1 AND activo = true',
      [rfidCode]
    );

    if (deportista.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró deportista con ese RFID' });
    }

    const dep = deportista.rows[0];

    // Verificar si el carril está ocupado
    const carrilOcupado = await query(
      'SELECT id FROM participaciones WHERE id_carrera = $1 AND carril = $2',
      [id, carril]
    );

    if (carrilOcupado.rows.length > 0) {
      return res.status(400).json({ error: `El carril ${carril} ya está ocupado` });
    }

    // Verificar si el deportista ya está en esta carrera
    const yaParticipa = await query(
      'SELECT carril FROM participaciones WHERE id_carrera = $1 AND id_deportista = $2',
      [id, dep.id]
    );

    if (yaParticipa.rows.length > 0) {
      return res.status(400).json({ 
        error: `${dep.nombre} ${dep.apellido} ya está en el carril ${yaParticipa.rows[0].carril}` 
      });
    }

    // Asignar carril
    const result = await query(`
      INSERT INTO participaciones (id_carrera, id_deportista, carril, estado)
      VALUES ($1, $2, $3, 'asignado')
      RETURNING *
    `, [id, dep.id, carril]);

    res.json({
      success: true,
      message: `${dep.nombre} ${dep.apellido} asignado al carril ${carril}`,
      participacion: {
        ...result.rows[0],
        deportista_nombre: dep.nombre,
        deportista_apellido: dep.apellido
      }
    });

  } catch (error) {
    console.error('Error al asignar carril:', error);
    res.status(500).json({ error: 'Error al asignar carril' });
  }
});

// POST /api/carreras/:id/asignar-siguiente - Asignar deportista al siguiente carril libre
router.post('/:id/asignar-siguiente', async (req, res) => {
  try {
    const { id } = req.params;
    const { rfidCode } = req.body;

    // Buscar deportista por RFID
    const deportista = await query(
      'SELECT id, nombre, apellido FROM deportistas WHERE rfid_code = $1 AND activo = true',
      [rfidCode]
    );

    if (deportista.rows.length === 0) {
      return res.status(404).json({ error: 'No se encontró deportista con ese RFID' });
    }

    const dep = deportista.rows[0];

    // Verificar si el deportista ya está en esta carrera
    const yaParticipa = await query(
      'SELECT carril FROM participaciones WHERE id_carrera = $1 AND id_deportista = $2',
      [id, dep.id]
    );

    if (yaParticipa.rows.length > 0) {
      return res.status(400).json({ 
        error: `${dep.nombre} ${dep.apellido} ya está en el carril ${yaParticipa.rows[0].carril}` 
      });
    }

    // Obtener número de carriles de la prueba
    const carreraInfo = await query(`
      SELECT p.num_carriles 
      FROM carreras c 
      JOIN pruebas p ON c.id_prueba = p.id 
      WHERE c.id = $1
    `, [id]);

    const numCarriles = carreraInfo.rows[0]?.num_carriles || 8;

    // Encontrar el siguiente carril libre
    const carrilesOcupados = await query(
      'SELECT carril FROM participaciones WHERE id_carrera = $1 ORDER BY carril',
      [id]
    );

    const ocupados = new Set(carrilesOcupados.rows.map(r => r.carril));
    let carrilLibre = null;

    for (let i = 1; i <= numCarriles; i++) {
      if (!ocupados.has(i)) {
        carrilLibre = i;
        break;
      }
    }

    if (carrilLibre === null) {
      return res.status(400).json({ error: 'No hay carriles disponibles' });
    }

    // Asignar carril
    const result = await query(`
      INSERT INTO participaciones (id_carrera, id_deportista, carril, estado)
      VALUES ($1, $2, $3, 'asignado')
      RETURNING *
    `, [id, dep.id, carrilLibre]);

    res.json({
      success: true,
      message: `${dep.nombre} ${dep.apellido} asignado al carril ${carrilLibre}`,
      participacion: {
        ...result.rows[0],
        deportista_nombre: dep.nombre,
        deportista_apellido: dep.apellido,
        rfid_code: rfidCode
      }
    });

  } catch (error) {
    console.error('Error al asignar carril:', error);
    res.status(500).json({ error: 'Error al asignar carril' });
  }
});

// PUT /api/carreras/:id/iniciar - Iniciar la carrera
router.put('/:id/iniciar', async (req, res) => {
  try {
    const { id } = req.params;
    const { tiempoInicio } = req.body; // timestamp del sensor

    const result = await query(`
      UPDATE carreras 
      SET estado = 'en_curso', 
          tiempo_inicio = $1,
          tiempo_inicio_real = NOW()
      WHERE id = $2
      RETURNING *
    `, [tiempoInicio || Date.now(), id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    // Actualizar estado de participantes
    await query(
      "UPDATE participaciones SET estado = 'en_carrera' WHERE id_carrera = $1",
      [id]
    );

    res.json({
      success: true,
      message: 'Carrera iniciada',
      carrera: result.rows[0]
    });

  } catch (error) {
    console.error('Error al iniciar carrera:', error);
    res.status(500).json({ error: 'Error al iniciar carrera' });
  }
});

// PUT /api/carreras/:id/registrar-llegada - Registrar llegada de un deportista
router.put('/:id/registrar-llegada', async (req, res) => {
  try {
    const { id } = req.params;
    const { carril, tiempoLlegada, rfidCode } = req.body;

    // Obtener tiempo de inicio de la carrera
    const carrera = await query(
      'SELECT tiempo_inicio FROM carreras WHERE id = $1',
      [id]
    );

    if (carrera.rows.length === 0) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    const tiempoInicio = carrera.rows[0].tiempo_inicio;
    const tiempoFinalMs = tiempoLlegada - tiempoInicio;

    // Actualizar participación
    const result = await query(`
      UPDATE participaciones 
      SET tiempo_llegada = $1,
          tiempo_final_ms = $2,
          rfid_detectado = $3,
          estado = 'finalizado',
          llegada_en = NOW()
      WHERE id_carrera = $4 AND carril = $5
      RETURNING *
    `, [tiempoLlegada, tiempoFinalMs, rfidCode, id, carril]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participación no encontrada' });
    }

    // Verificar si todos terminaron
    const pendientes = await query(
      "SELECT COUNT(*) as count FROM participaciones WHERE id_carrera = $1 AND estado != 'finalizado'",
      [id]
    );

    const todosTerminaron = parseInt(pendientes.rows[0].count) === 0;

    res.json({
      success: true,
      message: `Llegada registrada en carril ${carril}`,
      participacion: result.rows[0],
      tiempoFinalMs,
      todosTerminaron
    });

  } catch (error) {
    console.error('Error al registrar llegada:', error);
    res.status(500).json({ error: 'Error al registrar llegada' });
  }
});

// PUT /api/carreras/:id/finalizar - Finalizar carrera y calcular posiciones
router.put('/:id/finalizar', async (req, res) => {
  try {
    const { id } = req.params;

    // Calcular posiciones
    await query(`
      WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY tiempo_final_ms ASC NULLS LAST) as pos
        FROM participaciones
        WHERE id_carrera = $1 AND estado = 'finalizado'
      )
      UPDATE participaciones p
      SET posicion = r.pos
      FROM ranked r
      WHERE p.id = r.id
    `, [id]);

    // Actualizar estado de la carrera
    await query(`
      UPDATE carreras 
      SET estado = 'finalizada', finalizado_en = NOW()
      WHERE id = $1
    `, [id]);

    // Obtener resultados finales
    const resultados = await query(`
      SELECT 
        pa.*,
        d.nombre as deportista_nombre,
        d.apellido as deportista_apellido,
        d.rfid_code,
        cl.nombre as club_nombre
      FROM participaciones pa
      JOIN deportistas d ON pa.id_deportista = d.id
      LEFT JOIN clubes cl ON d.id_club = cl.id
      WHERE pa.id_carrera = $1
      ORDER BY pa.posicion NULLS LAST
    `, [id]);

    // Guardar en resultados_oficiales
    for (const r of resultados.rows) {
      if (r.tiempo_final_ms) {
        const minutos = Math.floor(r.tiempo_final_ms / 60000);
        const segundos = Math.floor((r.tiempo_final_ms % 60000) / 1000);
        const centesimas = Math.floor((r.tiempo_final_ms % 1000) / 10);
        const tiempoFormato = `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}.${String(centesimas).padStart(2, '0')}`;
        
        await query(`
          INSERT INTO resultados_oficiales (id_carrera, id_deportista, id_club, posicion, tiempo_oficial_ms, tiempo_formato)
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT DO NOTHING
        `, [id, r.deportista_id, r.id_club, r.posicion, r.tiempo_final_ms, tiempoFormato]);
      }
    }

    res.json({
      success: true,
      message: 'Carrera finalizada',
      resultados: resultados.rows
    });

  } catch (error) {
    console.error('Error al finalizar carrera:', error);
    res.status(500).json({ error: 'Error al finalizar carrera' });
  }
});

// DELETE /api/carreras/:id/participacion/:carril - Quitar deportista de un carril
router.delete('/:id/participacion/:carril', async (req, res) => {
  try {
    const { id, carril } = req.params;

    const result = await query(
      'DELETE FROM participaciones WHERE id_carrera = $1 AND carril = $2 RETURNING *',
      [id, carril]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Participación no encontrada' });
    }

    res.json({ success: true, message: `Carril ${carril} liberado` });

  } catch (error) {
    console.error('Error al quitar participación:', error);
    res.status(500).json({ error: 'Error al quitar participación' });
  }
});

module.exports = router;
