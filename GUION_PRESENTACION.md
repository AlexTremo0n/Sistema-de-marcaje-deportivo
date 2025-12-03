# GUIÓN DE PRESENTACIÓN ORAL
## Sistema de Marcaje Deportivo con IoT
### Duración estimada: 15-20 minutos

---

# PARTE 1: PRESENTADOR A (7-10 minutos)

## 1. INTRODUCCIÓN Y PROBLEMA (3 minutos)

**[PRESENTADOR A]**

> "Buenos días/tardes. Mi nombre es [NOMBRE] y junto a mi compañero/a [NOMBRE] les presentaremos nuestro proyecto: Sistema de Marcaje Deportivo con tecnología IoT.
>
> Antes de mostrarles la solución, permítanme contextualizar el problema que identificamos.
>
> **El Problema:**
>
> En las competencias de natación a nivel de clubes, federaciones regionales y eventos escolares en Chile, el cronometraje se realiza de forma manual. Esto significa que hay una persona con un cronómetro en cada carril, presionando un botón cuando el nadador toca la pared.
>
> Este método presenta varios problemas críticos:
>
> 1. **Error humano**: El tiempo de reacción de una persona es de aproximadamente 200 a 300 milisegundos. En una carrera donde las diferencias pueden ser de centésimas de segundo, esto es inaceptable.
>
> 2. **Inconsistencia**: Cada cronometrista tiene un tiempo de reacción diferente, lo que genera inequidad entre carriles.
>
> 3. **Disputas y reclamos**: Los resultados manuales frecuentemente son cuestionados por entrenadores y deportistas.
>
> 4. **Costo de sistemas profesionales**: Los sistemas de cronometraje profesional como Omega o Swiss Timing cuestan entre 50,000 y 200,000 dólares, haciéndolos inaccesibles para la mayoría de organizaciones deportivas.
>
> 5. **Registro manual de datos**: Los resultados se anotan en papel, lo que genera errores de transcripción y dificulta el análisis histórico.
>
> **¿A quién afecta?**
>
> - Más de 50 clubes de natación en Chile
> - Federaciones regionales
> - Competencias escolares y universitarias
> - Miles de deportistas que merecen resultados precisos y justos"

---

## 2. LA SOLUCIÓN PROPUESTA (2 minutos)

**[PRESENTADOR A]**

> "Nuestra solución es un **Sistema de Marcaje Deportivo IoT de bajo costo** que automatiza completamente el cronometraje.
>
> **¿Cómo funciona?**
>
> El sistema tiene tres componentes principales que trabajan de forma integrada:
>
> 1. **Pulseras RFID**: Cada nadador usa una pulsera con un chip RFID único que lo identifica. Esta pulsera es resistente al agua y tiene un código único asignado.
>
> 2. **Sensores en cada carril**: En el borde de la piscina, instalamos sensores que detectan cuando la pulsera del nadador toca la pared. El sensor registra el momento exacto en milisegundos.
>
> 3. **Plataforma web centralizada**: Todos los datos se envían en tiempo real a una aplicación web donde el juez de competencia puede ver los tiempos, posiciones y gestionar toda la competencia.
>
> **El flujo es simple:**
>
> - El juez presiona "Iniciar Carrera" → Se registra el tiempo de inicio
> - Cada nadador toca la pared → El sensor detecta su pulsera y envía el tiempo
> - El sistema calcula automáticamente el tiempo final y la posición
> - Los resultados se guardan en la base de datos para consulta histórica"

---

## 3. ARQUITECTURA TECNOLÓGICA (2-3 minutos)

**[PRESENTADOR A]**

> "Ahora explicaré las plataformas tecnológicas que seleccionamos y por qué cada una es adecuada para resolver las necesidades del negocio.
>
> **[Rúbrica 3.1.1.1 - Plataformas adecuadas]**
>
> Nuestra arquitectura se compone de:
>
> **Hardware IoT:**
> - **ESP32**: Microcontrolador con WiFi integrado, ideal para IoT por su bajo consumo y conectividad. Costo aproximado: $5 USD por unidad.
> - **Lector RFID RC522**: Detecta las pulseras a una distancia de hasta 5cm, suficiente para el toque en pared. Costo: $3 USD.
> - **Pulseras RFID**: Tags pasivos resistentes al agua. Costo: $0.50 USD cada una.
>
> **Backend:**
> - **Node.js con Express**: Framework ligero y eficiente para APIs REST. Elegido por su capacidad de manejar múltiples conexiones simultáneas en tiempo real.
> - **PostgreSQL en NeonDB**: Base de datos relacional robusta, alojada en la nube con alta disponibilidad. Elegida por su integridad referencial, crucial para datos de competencia oficiales.
>
> **Frontend:**
> - **React**: Biblioteca para interfaces de usuario reactivas. Permite que el cronómetro y los carriles se actualicen en tiempo real sin recargar la página.
>
> **Infraestructura:**
> - **Railway**: Plataforma de despliegue que permite escalar automáticamente según demanda. Ideal para eventos donde puede haber picos de uso.
>
> **Integración:**
> - **n8n**: Plataforma de automatización que conecta los sensores IoT con el backend. Permite agregar integraciones futuras sin modificar código.
>
> **[Rúbrica 3.1.1.2 - Herramientas se complementan]**
>
> Estas herramientas se complementan de la siguiente manera:
>
> El **ESP32** captura el evento físico y lo envía vía WiFi → **n8n** recibe el webhook y lo procesa → **Node.js** valida y almacena en **PostgreSQL** → **React** consulta la API y actualiza la interfaz en tiempo real.
>
> Cada componente tiene una responsabilidad específica y se comunican mediante protocolos estándar (HTTP/REST), lo que permite reemplazar o actualizar cualquier componente sin afectar los demás."

---

# PARTE 2: PRESENTADOR B (7-10 minutos)

## 4. DEMOSTRACIÓN DEL PROTOTIPO FÍSICO (3-4 minutos)

**[PRESENTADOR B]**

> "Gracias [NOMBRE]. Ahora les mostraré el prototipo funcionando en vivo.
>
> **[Mostrar el hardware]**
>
> Aquí tenemos:
> - El ESP32 conectado al lector RFID - esto simula el sensor de un carril
> - Las pulseras RFID que usarían los nadadores
>
> **[Mostrar la web en pantalla]**
>
> Y en la pantalla pueden ver nuestra plataforma web. Voy a simular una carrera completa:
>
> 1. **Primero ingreso al sistema** [hacer login con admin/admin123]
>
> 2. **Creo una nueva competencia** - selecciono la prueba "50m Estilo Libre" y la categoría "Senior"
>
> 3. **Asigno deportistas a los carriles** - cada deportista tiene su pulsera RFID previamente registrada [mostrar la asignación]
>
> 4. **Inicio la carrera** [presionar el botón de iniciar] - observen cómo el cronómetro comienza a correr en tiempo real
>
> 5. **Ahora simulo las llegadas** - [acercar cada pulsera al sensor] - cuando el sensor detecta la pulsera, inmediatamente aparece el tiempo en el carril correspondiente
>
> [Hacer la demostración con 2-3 pulseras]
>
> 6. **Finalizo la carrera** - el sistema automáticamente calcula las posiciones basándose en los tiempos
>
> 7. **Vemos los resultados** [ir a la pestaña Resultados] - aquí aparece el podio con los tiempos oficiales, y estos datos quedan guardados permanentemente en la base de datos
>
> **[Rúbrica 3.1.1.3 - Procesos de negocio sustentables]**
>
> Los procesos que acabamos de ver resuelven directamente la problemática:
>
> - **Registro de deportistas**: Cada atleta se vincula una vez a su pulsera RFID
> - **Gestión de competencias**: Creación de eventos, pruebas y series
> - **Cronometraje automático**: Elimina el error humano
> - **Cálculo de posiciones**: Instantáneo y sin disputas
> - **Historial persistente**: Los resultados se almacenan para análisis futuro
>
> Estos procesos son sustentables porque una vez implementados, el sistema puede operar con mínima intervención manual, reduciendo costos operativos y aumentando la confiabilidad."

---

## 5. INNOVACIÓN Y DIFERENCIACIÓN (2 minutos)

**[PRESENTADOR B]**

> "**[Rúbrica 3.1.2.4 - Innovación]**
>
> ¿Qué hace diferente a nuestra solución de las existentes?
>
> **Comparado con sistemas profesionales (Omega, Swiss Timing):**
> - Nuestro costo es de aproximadamente $200-300 USD para una instalación de 8 carriles
> - Los sistemas profesionales cuestan $50,000+ USD
> - Esto representa una reducción de costos del 99%
>
> **Comparado con el cronometraje manual:**
> - Precisión de milisegundos vs. error humano de 200-300ms
> - Registro automático vs. transcripción manual
> - Identificación automática del nadador vs. posibles confusiones
>
> **Comparado con otras soluciones IoT existentes:**
> - Usamos RFID pasivo (sin batería) vs. soluciones con sensores activos que requieren carga
> - Integración con plataforma web completa vs. solo hardware
> - Arquitectura modular que permite escalar vs. sistemas cerrados
>
> **Innovaciones específicas:**
> 1. Uso de pulseras RFID sumergibles de bajo costo
> 2. Arquitectura serverless que reduce costos de infraestructura
> 3. Integración con n8n que permite agregar funcionalidades sin programar (notificaciones, exportación a Excel, etc.)"

---

## 6. BUENAS PRÁCTICAS Y EVALUACIONES (2 minutos)

**[PRESENTADOR B]**

> "**[Rúbrica 3.1.2.5 - Razonabilidad y buenas prácticas]**
>
> Nuestro desarrollo cumple con estándares profesionales:
>
> **Evaluación Técnica:**
> - Arquitectura REST siguiendo estándares de la industria
> - Base de datos normalizada con integridad referencial
> - Código modular y mantenible
> - Validación de datos en frontend y backend
>
> **Evaluación Operativa:**
> - Interfaz intuitiva que requiere mínima capacitación
> - Sistema diseñado para funcionar con conexión WiFi estándar
> - Recuperación automática ante fallos de conexión
>
> **Evaluación Económica:**
> - Costo de implementación: ~$300 USD (hardware) + ~$20 USD/mes (hosting)
> - ROI positivo desde la primera competencia al eliminar costos de cronometristas
> - Modelo escalable: agregar carriles cuesta ~$15 USD adicionales cada uno
>
> **Evaluación Legal:**
> - Los datos personales (nombre, RUT) se almacenan de forma segura
> - Cumplimiento con principios de protección de datos
> - Los resultados son auditables y trazables
>
> **Evaluación Ambiental:**
> - Hardware de bajo consumo energético (ESP32 consume menos de 0.5W)
> - Pulseras RFID reutilizables
> - Eliminación del uso de papel para registros
>
> **[Rúbrica 3.1.2.6 - Estabilidad, rendimiento y diseño]**
>
> **Estabilidad:**
> - Base de datos PostgreSQL con respaldo automático en la nube
> - Servidor en Railway con 99.9% de uptime garantizado
>
> **Rendimiento:**
> - Tiempo de respuesta de API menor a 100ms
> - Actualización de interfaz en tiempo real cada 10ms para el cronómetro
> - Capacidad de manejar múltiples carreras simultáneas
>
> **Diseño:**
> - Interfaz responsive que funciona en desktop, tablet y móvil
> - Diseño limpio y profesional con paleta de colores coherente
> - Flujo de usuario intuitivo: 3 clicks para iniciar una carrera"

---

## 7. CIERRE (1 minuto)

**[PRESENTADOR A o B]**

> "En resumen, hemos desarrollado una solución que:
>
> 1. **Resuelve un problema real**: El cronometraje manual en natación
>
> 2. **Es accesible**: Con un costo 99% menor que las alternativas profesionales
>
> 3. **Es precisa**: Elimina el error humano con detección automática
>
> 4. **Es escalable**: Puede crecer desde un club pequeño hasta una federación completa
>
> 5. **Es innovadora**: Combina tecnologías IoT de bajo costo con plataformas cloud modernas
>
> El prototipo que han visto está completamente funcional y listo para ser probado en condiciones reales de competencia.
>
> ¿Tienen alguna pregunta?"

---

# POSIBLES PREGUNTAS Y RESPUESTAS

## P: ¿Qué pasa si falla el WiFi durante una carrera?
> R: El ESP32 tiene memoria local y puede almacenar los eventos temporalmente. Cuando se recupera la conexión, envía los datos pendientes con sus timestamps originales, garantizando que los tiempos sean correctos.

## P: ¿Cómo evitan que un nadador use la pulsera de otro?
> R: Cada pulsera tiene un código único vinculado al deportista. Si se detecta una pulsera no asignada a ese carril, el sistema genera una alerta. Además, las pulseras se entregan controladamente antes de cada carrera.

## P: ¿Qué precisión tiene el sistema?
> R: El sistema tiene precisión de milisegundos (1/1000 de segundo). El estándar de la FINA para competencias oficiales es centésimas de segundo, así que superamos ampliamente el requerimiento.

## P: ¿Funciona bajo el agua?
> R: Las pulseras RFID son resistentes al agua (IP67). El sensor está fuera del agua, en el borde de la piscina. La detección ocurre cuando la pulsera toca la pared, momento en que está cerca del sensor.

## P: ¿Cuánto tiempo toma implementar el sistema?
> R: La instalación de hardware toma aproximadamente 2-3 horas para 8 carriles. La configuración del software es inmediata ya que está en la nube.

## P: ¿Requiere internet permanente?
> R: Para la operación completa sí, pero puede funcionar en modo local con un servidor en la misma red de la piscina si no hay internet disponible.

---

# CHECKLIST ANTES DE PRESENTAR

- [ ] Verificar que la web esté funcionando (https://sistema-de-marcaje-deportivo-production.up.railway.app)
- [ ] Probar login con admin/admin123
- [ ] Verificar que el ESP32 esté encendido y conectado al WiFi
- [ ] Tener las pulseras RFID listas y probadas
- [ ] Hacer una carrera de prueba antes de la presentación
- [ ] Tener el celular en silencio
- [ ] Llevar cargador para el ESP32 (por si acaso)

---

# DISTRIBUCIÓN DE TIEMPO SUGERIDA

| Sección | Presentador | Tiempo |
|---------|-------------|--------|
| Introducción y Problema | A | 3 min |
| Solución Propuesta | A | 2 min |
| Arquitectura Tecnológica | A | 3 min |
| Demo Prototipo Físico | B | 4 min |
| Innovación | B | 2 min |
| Buenas Prácticas | B | 2 min |
| Cierre | A o B | 1 min |
| Preguntas | Ambos | 3-5 min |
| **TOTAL** | | **20-22 min** |

---

# TIPS PARA LA PRESENTACIÓN

1. **Practicar la demo** al menos 3 veces antes
2. **Tener un plan B**: Si el hardware falla, pueden simular los toques manualmente desde la consola del navegador
3. **Hablar despacio** cuando expliquen conceptos técnicos
4. **Mirar al evaluador**, no a la pantalla
5. **Dividir claramente** quién habla en cada momento
6. **Usar las palabras clave** de la rúbrica: "plataformas adecuadas", "herramientas se complementan", "procesos sustentables", "innovación", "buenas prácticas", "estabilidad y rendimiento"
