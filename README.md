# Sistema de Marcaje Deportivo 🏊‍♂️

Sistema web para gestión de competencias deportivas con marcaje por RFID.

## 🛠️ Tecnologías

- **Frontend:** React
- **Backend:** Node.js + Express
- **Base de datos:** PostgreSQL (NeonDB)
- **Automatizaciones:** n8n (opcional)

## 🚀 Despliegue en Railway (Recomendado)

### 1. Configurar NeonDB

1. Crea una cuenta en [neon.tech](https://neon.tech)
2. Crea un nuevo proyecto
3. Copia tu connection string:
   ```
   postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```
4. En el SQL Editor de Neon, ejecuta el contenido de `database/schema.sql`

### 2. Desplegar en Railway

1. Ve a [railway.app](https://railway.app) y conecta tu cuenta de GitHub
2. Click en "New Project" → "Deploy from GitHub repo"
3. Selecciona este repositorio
4. Railway detectará que es un proyecto Node.js

### 3. Configurar Variables de Entorno en Railway

En el dashboard de Railway, ve a "Variables" y agrega:

```
DATABASE_URL=postgresql://user:pass@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
PORT=3001
NODE_ENV=production
```

### 4. Conectar con n8n

Para integrar con n8n:

1. En tu workflow de n8n, usa un nodo **HTTP Request**
2. Configura la URL de tu API desplegada:
   ```
   https://tu-app.railway.app/api/eventos
   ```
3. Usa método POST para enviar eventos desde tu hardware IoT

#### Ejemplo de webhook para n8n:

```json
POST /api/eventos/iot
Content-Type: application/json

{
  "carril": 1,
  "rfid": "000000010901",
  "evento": "TOQUE",
  "ts_evento": 1234567890
}
```

## 💻 Desarrollo Local

```bash
# Instalar dependencias del frontend
npm install

# Instalar dependencias del backend
cd server && npm install

# Configurar variables de entorno
cp server/.env.example server/.env
# Editar server/.env con tu DATABASE_URL de NeonDB

# Iniciar backend
cd server && npm start

# En otra terminal, iniciar frontend
npm start
```

## 📁 Estructura del Proyecto

```
├── src/                  # Frontend React
│   ├── App.js           # Componente principal
│   └── services/        # Servicios API
├── server/              # Backend Node.js
│   ├── index.js         # Servidor Express
│   ├── config/          # Configuración DB
│   └── routes/          # Rutas API
├── database/            # Scripts SQL
│   └── schema.sql       # Esquema de base de datos
└── public/              # Archivos estáticos
```

## 🔗 Endpoints API

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/deportistas` | Listar deportistas |
| GET | `/api/competencias` | Listar competencias |
| GET | `/api/carreras` | Listar carreras |
| POST | `/api/eventos/iot` | Recibir evento IoT |
| GET | `/api/catalogos/clubes` | Listar clubes |
| GET | `/api/catalogos/categorias` | Listar categorías |
| GET | `/api/catalogos/pruebas` | Listar pruebas |

## 📝 Licencia

MIT
