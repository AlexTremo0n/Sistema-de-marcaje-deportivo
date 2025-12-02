-- ============================================
-- SISTEMA DE MARCAJE DEPORTIVO - BASE DE DATOS
-- NeonDB (PostgreSQL)
-- ============================================

-- Extensión para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLA: usuarios
-- Usuarios que acceden al sistema web
-- ============================================
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE,
    rol VARCHAR(20) NOT NULL DEFAULT 'operador', -- 'admin', 'juez', 'operador'
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ultimo_acceso TIMESTAMP WITH TIME ZONE
);

-- Usuario admin por defecto (password: admin123)
INSERT INTO usuarios (username, password_hash, nombre, apellido, email, rol) 
VALUES ('admin', 'admin123', 'Administrador', 'Sistema', 'admin@fedesub.cl', 'admin')
ON CONFLICT (username) DO NOTHING;

-- ============================================
-- TABLA: clubes
-- Clubes deportivos registrados
-- ============================================
CREATE TABLE IF NOT EXISTS clubes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(150) NOT NULL,
    ciudad VARCHAR(100),
    direccion VARCHAR(255),
    telefono VARCHAR(20),
    email VARCHAR(150),
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clubes iniciales
INSERT INTO clubes (nombre, ciudad) VALUES 
    ('Club Acuático Santiago', 'Santiago'),
    ('Club Naval Valparaíso', 'Valparaíso'),
    ('Club Deportivo Concepción', 'Concepción'),
    ('Club La Serena', 'La Serena')
ON CONFLICT DO NOTHING;

-- ============================================
-- TABLA: categorias
-- Categorías de competencia
-- ============================================
CREATE TABLE IF NOT EXISTS categorias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(50) NOT NULL UNIQUE,
    edad_minima INTEGER,
    edad_maxima INTEGER,
    descripcion TEXT
);

-- Categorías iniciales
INSERT INTO categorias (nombre, edad_minima, edad_maxima) VALUES 
    ('Infantil', 8, 12),
    ('Juvenil', 13, 17),
    ('Junior', 18, 20),
    ('Senior', 21, 35),
    ('Master', 36, 99)
ON CONFLICT (nombre) DO NOTHING;

-- ============================================
-- TABLA: deportistas
-- Deportistas registrados en el sistema
-- ============================================
CREATE TABLE IF NOT EXISTS deportistas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    rut VARCHAR(12) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    fecha_nacimiento DATE,
    edad INTEGER,
    genero VARCHAR(10), -- 'M', 'F'
    id_club UUID REFERENCES clubes(id),
    id_categoria UUID REFERENCES categorias(id),
    rfid_code VARCHAR(50) UNIQUE, -- Código de la pulsera RFID
    foto_url VARCHAR(255),
    activo BOOLEAN DEFAULT true,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    actualizado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsqueda rápida por RFID
CREATE INDEX IF NOT EXISTS idx_deportistas_rfid ON deportistas(rfid_code);

-- ============================================
-- TABLA: pruebas
-- Tipos de pruebas/competencias disponibles
-- ============================================
CREATE TABLE IF NOT EXISTS pruebas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    codigo VARCHAR(20) UNIQUE NOT NULL,
    nombre VARCHAR(150) NOT NULL,
    distancia_metros INTEGER,
    num_carriles INTEGER DEFAULT 8,
    descripcion TEXT,
    activo BOOLEAN DEFAULT true
);

-- Pruebas iniciales
INSERT INTO pruebas (codigo, nombre, distancia_metros, num_carriles) VALUES 
    ('50M-LIBRE', '50m Estilo Libre', 50, 8),
    ('100M-LIBRE', '100m Estilo Libre', 100, 8),
    ('200M-LIBRE', '200m Estilo Libre', 200, 8),
    ('50M-RESCATE', '50m Rescate con Tubo', 50, 6),
    ('100M-RESCATE', '100m Rescate con Maniquí', 100, 6),
    ('200M-OBSTACULOS', '200m Carrera con Obstáculos', 200, 6)
ON CONFLICT (codigo) DO NOTHING;

-- ============================================
-- TABLA: competencias
-- Eventos/competencias programadas
-- ============================================
CREATE TABLE IF NOT EXISTS competencias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(200) NOT NULL,
    fecha DATE NOT NULL,
    lugar VARCHAR(200),
    id_usuario_creador UUID REFERENCES usuarios(id),
    estado VARCHAR(20) DEFAULT 'programada', -- 'programada', 'en_curso', 'finalizada', 'cancelada'
    observaciones TEXT,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- TABLA: carreras
-- Cada carrera/heat dentro de una competencia
-- ============================================
CREATE TABLE IF NOT EXISTS carreras (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_competencia UUID REFERENCES competencias(id) ON DELETE CASCADE,
    id_prueba UUID REFERENCES pruebas(id),
    id_categoria UUID REFERENCES categorias(id),
    numero_serie INTEGER DEFAULT 1, -- Serie/Heat number
    estado VARCHAR(20) DEFAULT 'pendiente', -- 'pendiente', 'asignando', 'lista', 'en_curso', 'finalizada'
    tiempo_inicio BIGINT, -- Timestamp del sensor cuando inicia
    tiempo_inicio_real TIMESTAMP WITH TIME ZONE, -- Hora real de inicio
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    finalizado_en TIMESTAMP WITH TIME ZONE
);

-- ============================================
-- TABLA: participaciones
-- Asignación de deportistas a carriles en cada carrera
-- ============================================
CREATE TABLE IF NOT EXISTS participaciones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_carrera UUID REFERENCES carreras(id) ON DELETE CASCADE,
    id_deportista UUID REFERENCES deportistas(id),
    carril INTEGER NOT NULL,
    tiempo_llegada BIGINT, -- Timestamp del sensor cuando llega
    tiempo_final_ms INTEGER, -- Tiempo calculado en milisegundos
    posicion INTEGER, -- Posición final (1ro, 2do, etc.)
    estado VARCHAR(20) DEFAULT 'asignado', -- 'asignado', 'en_carrera', 'finalizado', 'descalificado', 'no_presento'
    rfid_detectado VARCHAR(50), -- RFID detectado al llegar
    asignado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    llegada_en TIMESTAMP WITH TIME ZONE,
    
    UNIQUE(id_carrera, carril), -- Solo un deportista por carril en cada carrera
    UNIQUE(id_carrera, id_deportista) -- Un deportista solo puede estar una vez por carrera
);

-- Índices para búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_participaciones_carrera ON participaciones(id_carrera);
CREATE INDEX IF NOT EXISTS idx_participaciones_deportista ON participaciones(id_deportista);

-- ============================================
-- TABLA: evento_iot (YA EXISTE - tu tabla actual)
-- Eventos recibidos del hardware IoT
-- ============================================
-- Esta tabla YA EXISTE en tu BD con este nombre: evento_iot
-- Estructura:
-- CREATE TABLE IF NOT EXISTS evento_iot (
--     id_evento UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
--     carril INTEGER,
--     rfid TEXT,
--     evento TEXT, -- 'TOQUE', 'INICIO', etc.
--     ts_evento BIGINT, -- Timestamp del microcontrolador
--     recibido_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
--     payload JSONB
-- );

-- ============================================
-- TABLA: eventos_procesados
-- Registro de eventos del sensor ya procesados
-- ============================================
CREATE TABLE IF NOT EXISTS eventos_procesados (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_evento_sensor UUID NOT NULL, -- Referencia al evento original
    id_carrera UUID REFERENCES carreras(id),
    id_participacion UUID REFERENCES participaciones(id),
    tipo_procesamiento VARCHAR(50), -- 'inicio_carrera', 'llegada', 'asignacion_carril'
    procesado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resultado TEXT
);

-- ============================================
-- TABLA: resultados_oficiales
-- Resultados finales validados
-- ============================================
CREATE TABLE IF NOT EXISTS resultados_oficiales (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_carrera UUID REFERENCES carreras(id) ON DELETE CASCADE,
    id_deportista UUID REFERENCES deportistas(id),
    id_club UUID REFERENCES clubes(id),
    posicion INTEGER NOT NULL,
    tiempo_oficial_ms INTEGER NOT NULL,
    tiempo_formato VARCHAR(20), -- Formato legible: "01:23.45"
    puntos INTEGER DEFAULT 0,
    es_record BOOLEAN DEFAULT false,
    tipo_record VARCHAR(50), -- 'personal', 'club', 'nacional', etc.
    validado_por UUID REFERENCES usuarios(id),
    validado_en TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- VISTA: vista_carreras_activas
-- Vista para obtener carreras con información completa
-- ============================================
CREATE OR REPLACE VIEW vista_carreras_activas AS
SELECT 
    c.id,
    c.estado,
    c.numero_serie,
    c.tiempo_inicio,
    c.tiempo_inicio_real,
    p.nombre AS prueba_nombre,
    p.num_carriles,
    p.distancia_metros,
    cat.nombre AS categoria_nombre,
    comp.nombre AS competencia_nombre,
    comp.fecha AS competencia_fecha
FROM carreras c
JOIN pruebas p ON c.id_prueba = p.id
JOIN categorias cat ON c.id_categoria = cat.id
JOIN competencias comp ON c.id_competencia = comp.id
WHERE c.estado NOT IN ('finalizada', 'cancelada');

-- ============================================
-- VISTA: vista_participaciones_carrera
-- Vista para obtener participantes de una carrera
-- ============================================
CREATE OR REPLACE VIEW vista_participaciones_carrera AS
SELECT 
    p.id,
    p.id_carrera,
    p.carril,
    p.tiempo_llegada,
    p.tiempo_final_ms,
    p.posicion,
    p.estado,
    d.id AS deportista_id,
    d.nombre AS deportista_nombre,
    d.apellido AS deportista_apellido,
    d.rfid_code,
    d.rut,
    cl.nombre AS club_nombre,
    cat.nombre AS categoria_nombre
FROM participaciones p
JOIN deportistas d ON p.id_deportista = d.id
LEFT JOIN clubes cl ON d.id_club = cl.id
LEFT JOIN categorias cat ON d.id_categoria = cat.id;

-- ============================================
-- FUNCIÓN: calcular_posiciones
-- Calcula las posiciones finales de una carrera
-- ============================================
CREATE OR REPLACE FUNCTION calcular_posiciones(carrera_id UUID)
RETURNS VOID AS $$
BEGIN
    WITH ranked AS (
        SELECT id, ROW_NUMBER() OVER (ORDER BY tiempo_final_ms ASC NULLS LAST) as pos
        FROM participaciones
        WHERE id_carrera = carrera_id AND estado = 'finalizado'
    )
    UPDATE participaciones p
    SET posicion = r.pos
    FROM ranked r
    WHERE p.id = r.id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FUNCIÓN: formato_tiempo
-- Convierte milisegundos a formato mm:ss.cc
-- ============================================
CREATE OR REPLACE FUNCTION formato_tiempo(ms INTEGER)
RETURNS VARCHAR AS $$
DECLARE
    minutos INTEGER;
    segundos INTEGER;
    centesimas INTEGER;
BEGIN
    IF ms IS NULL THEN
        RETURN '--:--.--';
    END IF;
    
    minutos := ms / 60000;
    segundos := (ms % 60000) / 1000;
    centesimas := (ms % 1000) / 10;
    
    RETURN LPAD(minutos::TEXT, 2, '0') || ':' || 
           LPAD(segundos::TEXT, 2, '0') || '.' || 
           LPAD(centesimas::TEXT, 2, '0');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- Grants (ajustar según tu usuario de NeonDB)
-- ============================================
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO tu_usuario;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO tu_usuario;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO tu_usuario;

-- ============================================
-- DATOS DE PRUEBA (OPCIONAL)
-- ============================================

-- Deportistas de ejemplo
INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '18456789-0', 'Carlos', 'González', 22, '000000010901',
    (SELECT id FROM clubes WHERE nombre = 'Club Acuático Santiago' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Senior' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '18456789-0');

INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '19567890-1', 'María', 'Fernández', 19, '000000010902',
    (SELECT id FROM clubes WHERE nombre = 'Club Naval Valparaíso' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Senior' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '19567890-1');

INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '17345678-2', 'Pedro', 'Muñoz', 24, '000000010903',
    (SELECT id FROM clubes WHERE nombre = 'Club Deportivo Concepción' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Senior' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '17345678-2');

INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '20678901-3', 'Ana', 'López', 21, '000000010904',
    (SELECT id FROM clubes WHERE nombre = 'Club La Serena' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Senior' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '20678901-3');

INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '21789012-4', 'Diego', 'Soto', 16, '000000010905',
    (SELECT id FROM clubes WHERE nombre = 'Club Acuático Santiago' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Juvenil' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '21789012-4');

INSERT INTO deportistas (rut, nombre, apellido, edad, rfid_code, id_club, id_categoria)
SELECT 
    '22890123-5', 'Sofía', 'Ramírez', 17, '000000010906',
    (SELECT id FROM clubes WHERE nombre = 'Club Naval Valparaíso' LIMIT 1),
    (SELECT id FROM categorias WHERE nombre = 'Juvenil' LIMIT 1)
WHERE NOT EXISTS (SELECT 1 FROM deportistas WHERE rut = '22890123-5');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
