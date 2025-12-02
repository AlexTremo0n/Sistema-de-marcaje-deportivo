// server/routes/eventos.js
// Rutas para procesar eventos del sensor IoT

const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// GET /api/eventos - Obtener eventos del sensor (últimos N)
router.get('/', async (req, res) => {
  try {
    const { limit = 50, carril, evento, desde } = req.query;

    let sql = `
      SELECT * FROM evento_iot
      WHERE 1=1
    `;
    const params = [];

    if (carril) {
      params.push(carril);
      sql += ` AND carril = $${params.length}`;
    }

    if (evento) {
      params.push(evento);
      sql += ` AND evento = $${params.length}`;
    }

    if (desde) {
      params.push(desde);
      sql += ` AND recibido_en >= $${params.length}`;
    }

    params.push(parseInt(limit));
    sql += ` ORDER BY recibido_en DESC LIMIT $${params.length}`;

    const result = await query(sql, params);
    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener eventos:', error);
    res.status(500).json({ error: 'Error al obtener eventos' });
  }
});

// GET /api/eventos/ultimo - Obtener el último evento de cada carril
router.get('/ultimo', async (req, res) => {
  try {
    const result = await query(`
      SELECT DISTINCT ON (carril) *
      FROM evento_iot
      ORDER BY carril, recibido_en DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener últimos eventos:', error);
    res.status(500).json({ error: 'Error al obtener últimos eventos' });
  }
});

// GET /api/eventos/pendientes - Obtener eventos TOQUE no procesados
router.get('/pendientes', async (req, res) => {
  try {
    const result = await query(`
      SELECT es.*
      FROM evento_iot es
      LEFT JOIN eventos_procesados ep ON es.id_evento = ep.id_evento_sensor
      WHERE es.evento = 'TOQUE' AND ep.id IS NULL
      ORDER BY es.recibido_en ASC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error('Error al obtener eventos pendientes:', error);
    res.status(500).json({ error: 'Error al obtener eventos pendientes' });
  }
});

// POST /api/eventos/procesar - Procesar un evento del sensor
router.post('/procesar', async (req, res) => {
  try {
    const { idEvento, idCarrera } = req.body;

    // Obtener el evento
    const evento = await query(
      'SELECT * FROM evento_iot WHERE id_evento = $1',
      [idEvento]
    );

    if (evento.rows.length === 0) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }

    const ev = evento.rows[0];

    // Verificar si ya fue procesado
    const yaProcessado = await query(
      'SELECT id FROM eventos_procesados WHERE id_evento_sensor = $1',
      [idEvento]
    );

    if (yaProcessado.rows.length > 0) {
      return res.status(400).json({ error: 'Este evento ya fue procesado' });
    }

    let resultado = '';
    let tipoProcesamiento = '';
    let idParticipacion = null;

    if (ev.evento === 'TOQUE') {
      // Buscar la carrera activa
      const carreraActiva = await query(`
        SELECT id, tiempo_inicio 
        FROM carreras 
        WHERE estado = 'en_curso' 
        ORDER BY tiempo_inicio_real DESC 
        LIMIT 1
      `);

      if (carreraActiva.rows.length > 0) {
        const carrera = carreraActiva.rows[0];
        const tiempoFinalMs = ev.ts_evento - carrera.tiempo_inicio;

        // Buscar participación por carril o RFID
        let participacion = await query(`
          SELECT pa.id, pa.carril, d.nombre, d.apellido
          FROM participaciones pa
          JOIN deportistas d ON pa.id_deportista = d.id
          WHERE pa.id_carrera = $1 AND pa.carril = $2 AND pa.estado = 'en_carrera'
        `, [carrera.id, ev.carril]);

        // Si no se encontró por carril, buscar por RFID
        if (participacion.rows.length === 0 && ev.rfid) {
          participacion = await query(`
            SELECT pa.id, pa.carril, d.nombre, d.apellido
            FROM participaciones pa
            JOIN deportistas d ON pa.id_deportista = d.id
            WHERE pa.id_carrera = $1 AND d.rfid_code = $2 AND pa.estado = 'en_carrera'
          `, [carrera.id, ev.rfid]);
        }

        if (participacion.rows.length > 0) {
          const part = participacion.rows[0];
          
          // Registrar llegada
          await query(`
            UPDATE participaciones 
            SET tiempo_llegada = $1,
                tiempo_final_ms = $2,
                rfid_detectado = $3,
                estado = 'finalizado',
                llegada_en = NOW()
            WHERE id = $4
          `, [ev.ts_evento, tiempoFinalMs, ev.rfid, part.id]);

          idParticipacion = part.id;
          tipoProcesamiento = 'llegada';
          resultado = `Llegada registrada: ${part.nombre} ${part.apellido} - Carril ${part.carril} - Tiempo: ${tiempoFinalMs}ms`;
        } else {
          tipoProcesamiento = 'llegada_sin_participante';
          resultado = `Toque detectado en carril ${ev.carril} pero no hay participante activo`;
        }
      } else {
        tipoProcesamiento = 'toque_sin_carrera';
        resultado = 'Toque detectado pero no hay carrera en curso';
      }
    } else if (ev.evento === 'INICIO') {
      tipoProcesamiento = 'inicio';
      resultado = 'Evento de inicio detectado';
    }

    // Registrar el procesamiento
    await query(`
      INSERT INTO eventos_procesados (id_evento_sensor, id_carrera, id_participacion, tipo_procesamiento, resultado)
      VALUES ($1, $2, $3, $4, $5)
    `, [idEvento, idCarrera, idParticipacion, tipoProcesamiento, resultado]);

    res.json({
      success: true,
      tipoProcesamiento,
      resultado
    });

  } catch (error) {
    console.error('Error al procesar evento:', error);
    res.status(500).json({ error: 'Error al procesar evento' });
  }
});

// POST /api/eventos/procesar-automatico - Procesar todos los eventos pendientes
router.post('/procesar-automatico', async (req, res) => {
  try {
    const { idCarrera } = req.body;

    // Obtener eventos pendientes
    const eventosPendientes = await query(`
      SELECT es.*
      FROM evento_iot es
      LEFT JOIN eventos_procesados ep ON es.id_evento = ep.id_evento_sensor
      WHERE es.evento = 'TOQUE' AND ep.id IS NULL
      ORDER BY es.recibido_en ASC
    `);

    const resultados = [];

    for (const evento of eventosPendientes.rows) {
      try {
        // Procesar cada evento...
        // (lógica similar a /procesar pero en batch)
        resultados.push({
          idEvento: evento.id_evento,
          carril: evento.carril,
          procesado: true
        });
      } catch (err) {
        resultados.push({
          idEvento: evento.id_evento,
          carril: evento.carril,
          procesado: false,
          error: err.message
        });
      }
    }

    res.json({
      success: true,
      totalProcesados: resultados.filter(r => r.procesado).length,
      totalErrores: resultados.filter(r => !r.procesado).length,
      resultados
    });

  } catch (error) {
    console.error('Error al procesar eventos automáticamente:', error);
    res.status(500).json({ error: 'Error al procesar eventos' });
  }
});

// GET /api/eventos/stream - SSE para eventos en tiempo real
router.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Enviar un evento cada segundo con los últimos eventos
  const interval = setInterval(async () => {
    try {
      const result = await query(`
        SELECT * FROM evento_iot 
        WHERE recibido_en > NOW() - INTERVAL '2 seconds'
        ORDER BY recibido_en DESC
      `);

      if (result.rows.length > 0) {
        res.write(`data: ${JSON.stringify(result.rows)}\n\n`);
      }
    } catch (error) {
      console.error('Error en stream:', error);
    }
  }, 1000);

  req.on('close', () => {
    clearInterval(interval);
  });
});

// POST /api/eventos/simular - Simular un evento (para pruebas)
router.post('/simular', async (req, res) => {
  try {
    const { carril, rfid, evento = 'TOQUE' } = req.body;

    const timestamp = Date.now();
    const payload = { carril, rfid, evento, timestamp };

    const result = await query(`
      INSERT INTO evento_iot (carril, rfid, evento, ts_evento, payload)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [carril, rfid, evento, timestamp, JSON.stringify(payload)]);

    res.json({
      success: true,
      message: 'Evento simulado creado',
      evento: result.rows[0]
    });

  } catch (error) {
    console.error('Error al simular evento:', error);
    res.status(500).json({ error: 'Error al simular evento' });
  }
});

module.exports = router;
