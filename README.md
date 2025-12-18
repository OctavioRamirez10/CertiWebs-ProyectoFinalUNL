# CertiWebs

Sitio web educativo sobre informática, inspirado en estudiaencasa.fun. Incluye:

Tecnologías: HTML, CSS, JavaScript puro.

## Estructura

## Uso
Abre `index.html` en tu navegador para ver el sitio.
# CertiWebs

Sitio web educativo sobre informática, inspirado en estudiaencasa.fun.

Se agregaron mejoras al formulario de contacto para que los mensajes se guarden
en una base de datos SQLite y (opcionalmente) se envíen por correo vía SMTP.

Archivos relevantes:
- `contact.html` - Formulario actualizado
- `main.js` - Frontend: envía POST a `/api/contact`
- `database.js` - Inicializa la base SQLite y la tabla `contactos`
- `server.js` - API Express con endpoint `/api/contact`

Ejecución local
1. Instalar dependencias:

# CertiWebs

Proyecto web educativo (frontend + backend) con almacenamiento local en SQLite.

Resumen de cambios realizados
- Se limpió la estructura eliminando carpetas duplicadas.
- Se añadió hashing de contraseñas con `bcrypt` en el backend.
- Se añadió `seed.js` para poblar la base de datos con datos de ejemplo.

Archivos importantes
- `server.js`: API Express (registro, login, guardar resultados, contacto, certificados).
- `database.js`: Inicializa `certiweb.db` y crea las tablas si no existen.
- `seed.js`: Script para insertar usuarios y datos de ejemplo.
- `certiweb.db`: fichero SQLite (se crea automáticamente).

Estructura ahora
- `public/` — archivos estáticos (HTML, CSS, JS, admin UI). Abre `public/index.html` como raíz pública.
- `server/` — utilidades del backend: `database.js`, `seed.js`.
- `certiweb.db` — base de datos SQLite en la raíz.

Notas sobre cambios
- Moví el frontend a `public/` y el código de inicialización a `server/` para mayor orden.
- El servidor sirve estáticos desde `public/`.

Requisitos (tu máquina)
- Node.js (14+). En Windows, descargar desde https://nodejs.org/
- npm (viene con Node.js).

Instalación y puesta en marcha (PowerShell)
1. Abrir PowerShell en la carpeta del proyecto:

```powershell
Set-Location -LiteralPath "C:\Users\occta\Desktop\Importante\-CertiWebs-UNL-ProyectoFinal-OctavioRamirez-main"
```

2. Instalar dependencias:

```powershell
npm install
```

3. (Opcional) Crear archivo `.env` en la raíz para configurar SMTP y destinatario de contacto. Copia el contenido de `.env.example` y edita los valores:

```dotenv
# .env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=tu_usuario_smtp
SMTP_PASS=tu_password_smtp
SMTP_FROM="CertiWebs <no-reply@tudominio.com>"
CONTACT_RECIPIENT=tu_correo@dominio.com
```

4. Poblar la base de datos con datos de ejemplo (crea usuarios: `ana`, `juan`, `maria`):

```powershell
npm run seed
```

Credenciales de ejemplo (solo para desarrollo):
- Usuario: `ana` | Contraseña: `Ana12345`
- Usuario: `juan` | Contraseña: `Juan12345`
- Usuario: `maria` | Contraseña: `Maria12345`

5. Iniciar servidor:

```powershell
npm start
```

6. Abrir en el navegador:
- Frontend: `http://localhost:3000/index.html`
- Formularios: `contact.html`, `exams.html`, etc.

Endpoints principales (HTTP API)
- `POST /api/registro` — Registra usuario. Body: `{ username, password, email }`.
- `POST /api/login` — Login. Body: `{ username, password }`. Responde `{ id, username }`.
- `POST /api/examenes` — Guarda resultado. Body: `{ usuario_id, examen_id, puntuacion }`.
- `GET /api/examenes/:usuario_id` — Historial de exámenes.
- `POST /api/contact` — Guarda contacto y envía correo si SMTP configurado.
- `GET /api/certificados/:usuario_id` — Certificados del usuario.

Panel admin
- `admin.html` — Interfaz simple para listar `contactos` y `certificados`.
- Para acceder al panel via UI introduce la clave `ADMIN_KEY`.
- Variable de entorno: `ADMIN_KEY` (por defecto `admin1234`). Para cambiarla, añade en tu `.env`:

```dotenv
ADMIN_KEY=mi_clave_segura
```

Seguridad y producción
- Las contraseñas se almacenan hasheadas con `bcrypt`.
- Para producción conviene cambiar SQLite por una base de datos gestionada (Postgres/MySQL) y usar TLS/HTTPS.
- Configurar variables de entorno y no subir `.env` a repositorios públicos.

Migrar a MySQL/Postgres (opcional)
- Reescribir `database.js` para usar el cliente de la base elegida.
- Crear migraciones con herramientas del ORM elegido (por ejemplo `knex`, `sequelize` o `typeorm`).

Soporte y próximos pasos
- Puedo añadir panel admin, validaciones en backend, endpoints para CRUD de exámenes o migrar a Postgres si lo prefieres.

Si quieres que ejecute pruebas locales aquí, ten en cuenta que en este entorno remoto `npm` no está disponible: ejecuta los comandos de instalación y seed en tu máquina local y dime si quieres que yo haga cambios adicionales o cree endpoints nuevos.

---
Fecha de actualización: 2025-11-30
# CertiWebs-UNL-
