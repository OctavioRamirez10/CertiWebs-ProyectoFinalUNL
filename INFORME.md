CertiWebs es una plataforma web educativa desarrollada para ofrecer guías de estudio, exámenes técnicos y un sistema de certificación simple. El proyecto combina un frontend estático con un backend en Node.js y almacenamiento en SQLite, permitiendo registrar usuarios, iniciar sesión, rendir exámenes, guardar resultados, crear certificados y enviar mensajes de contacto.

### 2.1. Raíz del repositorio
- `package.json`: Dependencias, scripts y metadatos del proyecto.
- `server.js`: Servidor Node.js con Express.
- `.env.example`: Variables de entorno de ejemplo para SMTP, JWT y configuración adicional.
- `README.md`: Documentación base del proyecto.
- `vercel.json`: Configuración para despliegues en Vercel.
- `.gitignore`: Archivos excluidos del repositorio.
- `certiweb.db` (se crea al ejecutar el servidor): Base de datos SQLite.

### 2.2. Carpeta `public/`
Contiene el frontend estático de la aplicación:
- `index.html`: Página principal con información, navegación, modales de login y registro, acceso a exámenes y newsletter.
- `exams.html`: Panel donde el usuario visualiza los exámenes disponibles y su historial.
- `exam.html`: Página para rendir un examen específico.
- `contact.html`: Formulario de contacto para enviar consultas o reportes.
- `study-html-css.html`, `study-javascript.html`, `study-networks.html`, `study-systems.html`: Guías de estudio para cada materia.
- `styles.css`: Estilos globales y temas visuales.
- `main.js`: Lógica dinámica del frontend: autenticación, llamadas al backend, lectura de preguntas, temporizador, envío de exámenes, formulario de contacto.
- `images/`: Recursos gráficos utilizados en la interfaz.

### 2.3. Carpeta `server/`
Contiene la lógica del backend y la inicialización de la base de datos:
- `database.js`: Crea la base de datos SQLite y define las tablas necesarias.
- `seed.js`: Script de inicialización de datos de prueba.

### 3.1. Servidor Express
`server.js` configura un servidor Express que:
- Sirve archivos estáticos desde `public/`.
- Proporciona soporte CORS abierto (`*`).
- Utiliza `body-parser` para procesar JSON y formularios URL-encoded.
- Conecta con la base de datos SQLite mediante `server/database.js`.
- Utiliza `dotenv` para cargar variables de entorno.

### 3.2. Seguridad y autenticación
- `bcrypt`: Hash de contraseñas antes de guardarlas en la base de datos.
- `jsonwebtoken`: Generación y verificación de tokens JWT para autenticar peticiones.
- Middleware `verificarToken`: exige Authorization Bearer token en rutas privadas.
- `express-validator`: Validación y sanitización de entradas en los endpoints.

### 3.3. Endpoints principales
- `POST /api/registro`: Registra un nuevo usuario.
  - Entrada: `{ username, password, email }`.
  - Validaciones: username, email válido y password mínimo 6 caracteres.
  - Guarda el usuario con contraseña hasheada.
  - Devuelve token JWT.

- `POST /api/login`: Inicia sesión de usuario.
  - Entrada: `{ email, password }`.
  - Valida las credenciales en la tabla `usuarios`.
  - Devuelve token JWT.

- `POST /api/examenes`: Guarda el resultado de un examen.
  - Requiere token JWT válido.
  - Entrada: `{ usuario_id, examen_id, puntuacion }`.
  - Verifica que el token pertenezca al usuario que guarda el examen.
  - Guarda la puntuación en `examenes_completados`.

- `GET /api/examenes/:usuario_id`: Devuelve historial de exámenes del usuario.
  - Requiere token JWT y coincidencia de usuario.

- `POST /api/contact`: Recibe mensajes de contacto.
  - Entrada: `{ name, email, subject, message }`.
  - Guarda el mensaje en `contactos` con `fecha_envio`.
  - Si SMTP está configurado en `.env`, envía un correo al destinatario.

- `POST /api/newsletter`: Suscribe un correo al boletín.
  - Entrada: `{ email }`.
  - Guarda el email en `boletin` si no existe.

- `POST /api/certificados`: Crea un certificado para un examen.
  - Requiere token JWT.
  - Entrada: `{ usuario_id, examen_id }`.
  - Genera un `codigo_verificacion` único basado en timestamp.

- `GET /api/certificados/:usuario_id`: Devuelve certificados del usuario.
  - Requiere token JWT.

### 3.4. Manejo de errores
- Respuestas con códigos HTTP adecuados: `400`, `401`, `403`, `409`, `500`.
- Validaciones claras y sanitización de parámetros.
- Middleware global para capturar errores no manejados.
- Ruta 404 genérica para peticiones no encontradas.

`server/database.js` define las siguientes tablas:

- `usuarios`
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `username`: TEXT UNIQUE
  - `password`: TEXT
  - `email`: TEXT
  - `fecha_registro`: DATETIME

- `examenes_completados`
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `usuario_id`: INTEGER
  - `examen_id`: TEXT
  - `puntuacion`: INTEGER
  - `fecha`: DATETIME
  - FOREIGN KEY(usuario_id) REFERENCES usuarios(id)

- `certificados`
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `usuario_id`: INTEGER
  - `examen_id`: TEXT
  - `fecha_emision`: DATETIME
  - `codigo_verificacion`: TEXT UNIQUE
  - FOREIGN KEY(usuario_id) REFERENCES usuarios(id)

- `contactos`
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `nombre`: TEXT
  - `email`: TEXT
  - `asunto`: TEXT
  - `mensaje`: TEXT
  - `fecha_preferida`: DATETIME
  - `fecha_envio`: DATETIME

- `boletin`
  - `id`: INTEGER PRIMARY KEY AUTOINCREMENT
  - `email`: TEXT UNIQUE
  - `fecha_suscripcion`: DATETIME

El backend inserta usuarios de ejemplo si no existen:
- `octavio` / `Admin_123!`
- `usuario_demo` / `Demo_123!`
- `Administrador` / `Admin_1234!`

Estas cuentas son agregadas en el arranque por `server/database.js`.

### 5.1. Página principal (`index.html`)
- Presenta la oferta del sistema: cursos, guías y certificaciones.
- Muestra modales de login y registro.
- Controla la visualización de botones según si el usuario está logueado.
- Enlace a exámenes y recursos.

### 5.2. Login y registro
- Login: envía una petición POST a `/api/login`.
- Registro: envía una petición POST a `/api/registro`.
- Al recibir respuesta exitosa, guarda en `sessionStorage`:
  - `token`
  - `username`
  - `userId`
- La sesión se usa para alternar elementos de la UI y proteger acceso a páginas privadas.

### 5.3. Página de exámenes (`exams.html`)
- Carga dinámicamente una lista de exámenes disponibles.
- Muestra información de cada examen: nombre, descripción, preguntas, dificultad.
- Permite redirigir al examen seleccionado (
  `exam.html?exam=html` por ejemplo).
- Opcionalmente, puede mostrar el historial de exámenes si existe lógica asociada.

### 5.4. Página de examen individual (`exam.html`)
- Detecta el examen solicitado en query string (`exam=html`, `exam=js`, etc.).
- Carga las preguntas desde `main.js`.
- Muestra un temporizador, recorrido de preguntas y navegación anterior/siguiente.
- Al finalizar, calcula la puntuación y envía los resultados al backend.
- Si quedan preguntas sin responder, solicita confirmación antes de enviar.

### 5.5. Contacto (`contact.html`)
- Formulario de contacto con campos: nombre, email, tipo de consulta, asunto, mensaje.
- Envía datos a `/api/contact`.
- El backend guarda el mensaje y, si SMTP está bien configurado, envía un correo.
- El frontend muestra estados de éxito o error.

### 5.6. Suscripción al newsletter
- El formulario en `index.html` envía un correo a `/api/newsletter`.
- Guarda el email del usuario en la tabla `boletin`.

### 5.7. Protección de rutas
- `main.js` comprueba si hay token en `sessionStorage`.
- Si el usuario intenta abrir páginas privadas sin sesión, redirige a `index.html`.
- Esto protege las páginas de exámenes y las acciones de usuario.

### 6.1. Tecnologías usadas
- Frontend: HTML5, CSS3, JavaScript puro.
- Backend: Node.js, Express.
- Base de datos: SQLite3.
- Autenticación: JSON Web Tokens (JWT).
- Hashing: bcrypt.
- Validación: express-validator.
- Correo: nodemailer.
- Configuración: dotenv.

### 6.2. Dependencias en `package.json`
- `bcrypt`
- `body-parser`
- `dotenv`
- `express`
- `express-validator`
- `jsonwebtoken`
- `nodemailer`
- `sqlite3`

### 6.3. Scripts disponibles
- `npm start`: inicia el servidor Node en `server.js`.
- `npm run dev`: inicia `nodemon server.js` para desarrollo.
- `npm run seed`: ejecuta `node server/seed.js` y asegura inicialización de la DB.

### 7.1. Variables de entorno importantes
- `JWT_SECRET`: clave secreta para firmar tokens JWT.
- `ADMIN_KEY`: clave de administración (usada en la aplicación para paneles internos, si se implementa).
- `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`: configuraciones SMTP.
- `CONTACT_RECIPIENT`: correo que recibe los mensajes del formulario.
- `PORT`: puerto en el que corre el servidor.
- `DATABASE_PATH`: ruta del archivo SQLite si se desea cambiar ubicación.

### 7.2. Recommendations
- No subir `.env` a repositorios públicos.
- Usar HTTPS en producción.
- Cambiar `JWT_SECRET` y `ADMIN_KEY` por valores fuertes.
- Limitar CORS a orígenes conocidos.
- Evitar exponer variables de prueba en entornos reales.

### 8.1. Usuarios
- El sistema permite crear cuentas nuevas.
- Las contraseñas se almacenan hasheadas.
- El login devuelve token JWT para sesiones.
- El token es obligatorio para exámenes, certificados e historial.

### 8.2. Exámenes
- El sistema incluye exámenes predefinidos: HTML, CSS, JavaScript, Redes y Sistemas Operativos.
- Cada examen tiene 5 preguntas, tiempo limitado y navegación interna.
- El resultado se guarda en la base de datos.
- Permite crear certificados asociados a un usuario y examen.

### 8.3. Certificados
- Al aprobar o rendir un examen, el sistema puede generar un certificado con un código único.
- El certificado se persiste en la tabla `certificados`.
- Se puede consultar mediante el endpoint seguro `/api/certificados/:usuario_id`.

### 8.4. Contacto y soporte
- El formulario de contacto permite recibir consultas y sugerencias.
- El backend guarda los mensajes y puede enviar notificación por correo.
- Los datos quedan guardados en `contactos` con marca temporal.

### 8.5. Newsletter
- Suscripciones de correo se guardan en `boletin`.
- Evita duplicados por restricción UNIQUE.

### 9.1. Fortalezas
- Integración completa frontend/backend.
- Uso de JWT para seguridad de rutas.
- Almacenamiento persistente con SQLite.
- Lógica de examen y criterio de envío clara.
- Contacto con posible envío de correo.
- Estructura organizada para un proyecto final.

### 9.2. Mejoras recomendadas
- Consolidar la lógica de frontend en módulos más claros.
- Añadir tests automáticos para login/exámenes/contacto.
- Implementar un panel admin real.
- Mejorar UI/UX en exámenes y mensajes de error.
- Añadir paginación o consulta de historial para exámenes.
- Extender la generación de certificados a PDF descargable.
- Añadir protecciones de seguridad extra: rate limit, CSRF, validaciones avanzadas.

CertiWebs es una solución web pedagógica sólida que combina una interfaz moderna con un backend funcional. El sistema cuenta con gestión de usuarios, exámenes, historial, certificados y contacto, y está listo para ejecutarse localmente con Node.js y SQLite.

Con pocos ajustes, puede avanzar hacia un producto más completo: panel administrativo, despliegue seguro, más materias y una experiencia de certificación robusta.

---

1. Abrir la carpeta del proyecto.
2. Ejecutar `npm install`.
3. Copiar `.env.example` a `.env` y configurar variables si se quiere correo.
4. Ejecutar `npm run seed`.
5. Ejecutar `npm start`.
6. Acceder en el navegador: `http://localhost:3000/index.html`.
