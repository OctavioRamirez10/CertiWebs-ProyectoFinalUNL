// --- Funcionalidad básica para el formulario de contacto (solo si existe) ---
// Este código será reemplazado por la versión más completa más abajo

// Login/registro manejados más abajo con llamadas al API (evitar lógica simulada)

// --- EXÁMENES DISPONIBLES (HTML, CSS, JS, Redes, SO) ---
// --- PROTECCIÓN DE RUTAS GLOBAL ---
document.addEventListener('DOMContentLoaded', () => {
    const pathname = window.location.pathname;
    const isPublicPage = pathname.endsWith('/') || 
                         pathname.endsWith('index.html') || 
                         pathname.includes('study-') || 
                         pathname === '';
    const token = sessionStorage.getItem('token');
    
    if (!isPublicPage && !token) {
        console.log('Acceso denegado: redirigiendo a login');
        window.location.replace('index.html');
        return;
    }
});
const exams = [
    {
        id: 'html',
        nombre: 'HTML Básico',
        descripcion: 'Evalúa tus conocimientos sobre HTML y estructura web.',
        preguntas: 5,
        tiempo: 120,
        dificultad: 'Fácil'
    },
    {
        id: 'css',
        nombre: 'CSS Básico',
        descripcion: 'Conceptos básicos de estilos y selectores CSS.',
        preguntas: 5,
        tiempo: 120,
        dificultad: 'Fácil'
    },
    {
        id: 'js',
        nombre: 'JavaScript Básico',
        descripcion: 'Fundamentos de programación en JavaScript.',
        preguntas: 5,
        tiempo: 120,
        dificultad: 'Fácil'
    },
    {
        id: 'redes',
        nombre: 'Redes',
        descripcion: 'Conceptos básicos de redes y protocolos.',
        preguntas: 5,
        tiempo: 120,
        dificultad: 'Media'
    },
    {
        id: 'so',
        nombre: 'Sistemas Operativos',
        descripcion: 'Preguntas sobre sistemas operativos y comandos.',
        preguntas: 5,
        tiempo: 120,
        dificultad: 'Media'
    }
];

// Nota: la carga de exámenes y control de acceso se realiza en la sección que
// comprueba `window.location.pathname.endsWith('exams.html')` más abajo, usando
// la sesión del usuario proporcionada por el backend.

// --- PREGUNTAS DE EXAMEN Y LÓGICA DE RENDICIÓN ---
const examQuestions = {
    html: [
        { q: '¿Qué significa HTML?', o: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], a: 0, expl: 'HTML son las siglas de HyperText Markup Language, que se utiliza para estructurar y dar significado al contenido de la web.' },
        { q: '¿Cuál es la etiqueta correcta para un salto de línea en HTML?', o: ['&lt;br&gt;', '&lt;lb&gt;', '&lt;break&gt;'], a: 0, expl: 'La etiqueta &lt;br&gt; produce un salto de línea en el texto (retorno de carro) sin iniciar un nuevo párrafo.' },
        { q: '¿Qué atributo se usa para especificar un enlace?', o: ['src', 'href', 'link'], a: 1, expl: 'El atributo href (Hypertext Reference) especifica la URL de la página a la que va el enlace en una etiqueta &lt;a&gt;.' },
        { q: '¿Cuál es la etiqueta principal que engloba todo el documento HTML?', o: ['&lt;main&gt;', '&lt;body&gt;', '&lt;html&gt;'], a: 2, expl: 'La etiqueta &lt;html&gt; es el elemento raíz de una página HTML, todos los demás elementos deben descender de él.' },
        { q: '¿Qué extensión puede tener un archivo HTML?', o: ['.htm', '.html', 'Ambas'], a: 2, expl: 'Los archivos HTML pueden usar las extensiones .htm o .html de forma indistinta; históricamente .htm se usaba en sistemas antiguos que limitaban a 3 caracteres.' }
    ],
    css: [
        { q: '¿Qué significa CSS?', o: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Syntax'], a: 0, expl: 'CSS significa Cascading Style Sheets (Hojas de Estilo en Cascada), utilizado para describir la presentación de un documento HTML.' },
        { q: '¿Cómo se selecciona una clase en CSS?', o: ['#clase', '.clase', 'clase'], a: 1, expl: 'En CSS, el selector de clase se define con un punto (.) seguido del nombre de la clase.' },
        { q: '¿Cuál es la propiedad para cambiar el color de fondo?', o: ['background-color', 'color', 'bgcolor'], a: 0, expl: 'La propiedad background-color se utiliza para establecer el color de fondo de un elemento.' },
        { q: '¿Qué unidad es relativa al tamaño de fuente?', o: ['px', 'em', '%'], a: 1, expl: 'La unidad "em" es relativa al tamaño de fuente (font-size) del elemento padre o del propio elemento si se usa para otras propiedades.' },
        {
            q: '¿Cómo se comenta en CSS?', o: [
                '<span class="code-option">/* comentario */</span>',
                '<span class="code-option">// comentario</span>',
                '<span class="code-option">&lt;!-- comentario --&gt;</span>'
            ], a: 0, expl: 'En CSS, los comentarios de bloque se inician con /* y se cierran con */. No existe un formato de línea simple (//) en CSS puro.'
        }
    ],
    js: [
        { q: '¿Qué tipo de lenguaje es JavaScript?', o: ['Compilado', 'Interpretado', 'Ambos'], a: 1, expl: 'JavaScript es fundamentalmente un lenguaje interpretado, ejecutado línea por línea por el motor del navegador web (JIT).' },
        { q: '¿Cómo se declara una variable?', o: ['var x;', 'int x;', 'let x = 0;'], a: 0, expl: 'Tanto "var x;" como "let x = 0;" son correctos en JS. "var x;" es la declaración clásica y genérica en versiones anteriores a ES6.' },
        { q: '¿Qué método muestra un mensaje en pantalla?', o: ['alert()', 'print()', 'show()'], a: 0, expl: 'El método window.alert() o alert() detiene la ejecución y muestra un cuadro de diálogo con un mensaje de alerta en el navegador.' },
        { q: '¿Cuál NO es un tipo de dato en JS?', o: ['string', 'float', 'boolean'], a: 1, expl: 'JavaScript no diferencia entre enteros y flotantes como tipos separados; utiliza el tipo "number" para ambos.' },
        {
            q: '¿Cómo se escribe un comentario de una línea?', o: [
                '<span class="code-option">// comentario</span>',
                '<span class="code-option">/* comentario */</span>',
                '<span class="code-option">&lt;!-- comentario --&gt;</span>'
            ], a: 0, expl: 'El formato de doble barra (//) crea un comentario de una sola línea en JavaScript, que es ignorado durante la ejecución.'
        }
    ],
    redes: [
        { q: '¿Qué es una dirección IP?', o: ['Un identificador de red', 'Un protocolo', 'Un tipo de cable'], a: 0, expl: 'Una dirección IP es una etiqueta numérica única que identifica a un dispositivo en una red informática.' },
        { q: '¿Qué puerto usa HTTP?', o: ['21', '80', '443'], a: 1, expl: 'El puerto estándar por defecto para el protocolo HTTP de transferencia de hipertexto es el puerto 80.' },
        { q: '¿Qué significa LAN?', o: ['Large Area Network', 'Local Area Network', 'Light Area Network'], a: 1, expl: 'LAN significa Local Area Network (Red de Área Local), que conecta dispositivos dentro de un área física limitada como un edificio.' },
        { q: '¿Qué dispositivo conecta redes diferentes?', o: ['Switch', 'Router', 'Hub'], a: 1, expl: 'El router es el dispositivo de red encargado de reenviar paquetes de datos entre redes informáticas diferentes y determinar la mejor ruta.' },
        { q: '¿Qué protocolo asigna IP automáticamente?', o: ['DNS', 'DHCP', 'FTP'], a: 1, expl: 'El protocolo DHCP (Dynamic Host Configuration Protocol) asigna direcciones IP dinámicas y otros parámetros de configuración a los dispositivos.' }
    ],
    so: [
        { q: '¿Qué es un sistema operativo?', o: ['Un programa de aplicación', 'Un software de sistema', 'Un hardware'], a: 1, expl: 'Un sistema operativo es el software de sistema principal que gestiona el hardware del ordenador y proporciona servicios a los programas de aplicación.' },
        { q: '¿Cuál NO es un sistema operativo?', o: ['Linux', 'Windows', 'HTML'], a: 2, expl: 'HTML es un lenguaje de marcado de hipertexto utilizado para el desarrollo web, no un sistema operativo.' },
        { q: '¿Qué comando muestra archivos en Linux?', o: ['ls', 'cd', 'pwd'], a: 0, expl: 'El comando "ls" (list) se utiliza en sistemas tipo Unix/Linux para listar el contenido de archivos y directorios.' },
        { q: '¿Qué es un proceso?', o: ['Un programa en ejecución', 'Un archivo', 'Un usuario'], a: 0, expl: 'En informática, un proceso es básicamente una instancia de un programa de computadora que está siendo ejecutado por el sistema.' },
        { q: 'Qué sistema operativo es de código abierto?', o: ['Windows', 'Linux', 'macOS'], a: 1, expl: 'Linux es el sistema operativo de código abierto más popular, cuyo núcleo (kernel) está disponible libremente bajo la licencia GNU.' }
    ]
};

// Configuración de la API
// En desarrollo local se usa la dirección del puerto 3000.
// En producción (Netlify), debes reemplazar la URL de abajo con tu dirección de Render.
const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : 'https://certiwebs-backend.onrender.com/api'; // <-- Reemplaza con tu link de Render cuando lo crees

// Utilidades
const utils = {
    async fetchAPI(endpoint, options = {}) {
        try {
            const headers = {
                'Content-Type': 'application/json',
                ...options.headers
            };
            const token = sessionStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const response = await fetch(`${API_URL}/${endpoint}`, {
                ...options,
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.detalles && Array.isArray(data.detalles)) {
                    const msg = data.detalles.map(d => d.msg).join('. ');
                    throw new Error(msg);
                }
                throw new Error(data.error || 'Error en la petición');
            }
            return data;
        } catch (error) {
            console.error('Error API:', error);
            throw error;
        }
    },

    getUsuarioActual() {
        const id = sessionStorage.getItem('userId');
        const token = sessionStorage.getItem('token');
        if (!id || !token) return {};
        return {
            id,
            username: sessionStorage.getItem('username')
        };
    },

    setUsuarioActual(id, username) {
        sessionStorage.setItem('userId', id);
        sessionStorage.setItem('username', username);
    },

    cerrarSesion() {
        sessionStorage.removeItem('userId');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('token');
        window.location.href = 'index.html';
    },

    mostrarMensaje(elemento, mensaje, tipo = 'error') {
        if (elemento) {
            elemento.textContent = mensaje;
            elemento.className = tipo === 'success' ? 'success-message' : 'error-message';
            elemento.style.display = 'block';
        } else {
            console.error('Elemento no encontrado para mostrar mensaje:', mensaje);
        }
    }
};

// Gestión de autenticación
const auth = {
    async iniciarSesion(username, password) {
        try {
            const data = await utils.fetchAPI('login', {
                method: 'POST',
                body: JSON.stringify({ username, password })
            });
            utils.setUsuarioActual(data.id, data.username);
            return true;
        } catch (error) {
            throw new Error('Credenciales inválidas');
        }
    },

    async registrar(username, password, email) {
        try {
            const data = await utils.fetchAPI('registro', {
                method: 'POST',
                body: JSON.stringify({ username, password, email })
            });
            utils.setUsuarioActual(data.id, username);
            return true;
        } catch (error) {
            throw new Error('Error en el registro');
        }
    }
};

// Gestión de exámenes
const examenes = {
    async guardarResultado(examenId, puntuacion) {
        const usuario = utils.getUsuarioActual();
        return utils.fetchAPI('examenes', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuario.id,
                examen_id: examenId,
                puntuacion
            })
        });
    },

    async crearCertificado(usuarioId, examenId) {
        return utils.fetchAPI('certificados', {
            method: 'POST',
            body: JSON.stringify({
                usuario_id: usuarioId,
                examen_id: examenId
            })
        });
    },

    async obtenerHistorial() {
        const usuario = utils.getUsuarioActual();
        return utils.fetchAPI(`examenes/${usuario.id}`);
    }
};

// Manejadores de eventos para formularios
document.addEventListener('DOMContentLoaded', () => {
    // Formulario de contacto: enviar a /api/contact
    const contactoForm = document.getElementById('contacto-form');
    if (contactoForm) {
        console.log('Formulario de contacto encontrado, configurando evento submit');
        contactoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Enviando formulario de contacto...');
            
            const statusEl = document.getElementById('contact-status');
            const submitBtn = document.getElementById('contact-submit');
            
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const type = document.getElementById('contact-type').value;
            const rawSubject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
            // Combinar tipo y asunto
            const subject = `[${type}] ${rawSubject}`;
            
            // Validación básica
            if (!name || !email || !subject || !message) {
                statusEl.textContent = 'Por favor completa todos los campos obligatorios.';
                statusEl.className = 'status-message status-error';
                return;
            }
            
            // Deshabilitar botón durante el envío
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';
            
            try {
                const response = await fetch(`${API_URL}/contact`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, subject, message })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    statusEl.textContent = '¡Mensaje enviado correctamente! Te responderemos a la brevedad.';
                    statusEl.className = 'status-message status-success';
                    contactoForm.reset();
                    
                    // Redirigir después de 3 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 3000);
                } else {
                    throw new Error(data.error || 'Error al enviar mensaje');
                }
            } catch (error) {
                console.error('Error en contacto:', error);
                statusEl.textContent = 'Error al enviar el mensaje. Por favor intenta nuevamente.';
                statusEl.className = 'status-message status-error';
            } finally {
                // Rehabilitar botón
                submitBtn.disabled = false;
                submitBtn.textContent = 'Enviar Mensaje';
            }
        });
    } else {
        console.log('Formulario de contacto no encontrado');
    }

    // Formulario de login
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            console.log('Submit de login activado');
            e.preventDefault();
            
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value;
            const msgElement = document.querySelector('#loginModal .login-msg');
            
            console.log('Intentando login con email:', email);

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    sessionStorage.setItem('token', data.token);
                    sessionStorage.setItem('username', data.username);
                    sessionStorage.setItem('userId', data.id);
                    
                    if (msgElement) {
                        msgElement.innerHTML = `¡Bienvenido/a <strong>${data.username}</strong>! 🎉<br>Sesión iniciada correctamente. Redirigiendo...`;
                        msgElement.className = 'login-msg success-message';
                        msgElement.style.display = 'block';
                    }
                    
                    setTimeout(() => {
                        const loginModal = document.getElementById('loginModal');
                        if (loginModal) loginModal.style.display = 'none';
                        window.location.reload();
                    }, 1000);
                } else {
                    if (msgElement) {
                        msgElement.textContent = data.error || 'Error al iniciar sesión';
                        msgElement.className = 'login-msg error-message';
                        msgElement.style.display = 'block';
                    }
                }
            } catch (error) {
                console.error('Error en login:', error);
                if (msgElement) {
                    msgElement.textContent = 'Error de conexión. Intenta nuevamente.';
                    msgElement.className = 'login-msg error-message';
                    msgElement.style.display = 'block';
                }
            }
        });
    }

    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value;
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const email = document.getElementById('register-email').value;
            const msgElement = document.querySelector('#registerModal .register-msg');

            if (password !== passwordConfirm) {
                utils.mostrarMensaje(msgElement, 'Las contraseñas no coinciden', 'error');
                return;
            }

            try {
                const data = await utils.fetchAPI('registro', {
                    method: 'POST',
                    body: JSON.stringify({ username, password, email })
                });
                
                // Guardar la sesión automáticamente
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('userId', data.id);
                
                // Mostrar mensaje de éxito y ocultar el formulario
                utils.mostrarMensaje(msgElement, '¡Registro exitoso! Iniciando sesión automáticamente...', 'success');
                registerForm.style.display = 'none';

                // Agregar un botón para que el usuario pueda cerrar el cartel manualmente
                const closeBtn = document.createElement('button');
                closeBtn.textContent = 'Aceptar / Cerrar';
                closeBtn.className = 'btn-principal';
                closeBtn.style.marginTop = '1.5rem';
                closeBtn.style.width = '100%';
                closeBtn.onclick = () => {
                    if (typeof closeModal === 'function') {
                        closeModal('registerModal');
                    } else {
                        const modal = document.getElementById('registerModal');
                        if (modal) modal.style.display = 'none';
                    }
                    window.location.reload();
                };
                msgElement.parentNode.appendChild(closeBtn);

                // Actualizar estado de sesión en el frontend inmediatamente
                if (typeof actualizarEstadoSesion === 'function') {
                    actualizarEstadoSesion();
                }

                // Cerrar modal automáticamente después de 2.5 segundos si el usuario no hizo clic
                setTimeout(() => {
                    if (typeof closeModal === 'function') {
                        closeModal('registerModal');
                    } else {
                        const modal = document.getElementById('registerModal');
                        if (modal) modal.style.display = 'none';
                    }
                    window.location.reload();
                }, 2500);

            } catch (error) {
                if (error.message.includes('ya existe') || error.message.includes('duplicate')) {
                    utils.mostrarMensaje(msgElement, 'Este usuario o email ya está registrado. Por favor intenta con otro o inicia sesión.', 'error');
                } else {
                    utils.mostrarMensaje(msgElement, error.message || 'Error en el registro', 'error');
                }
            }
        });
    }

    // Botón de logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const modal = document.getElementById('logoutConfirmModal');
            if (modal) {
                modal.style.display = 'block';
            } else {
                utils.cerrarSesion();
            }
        });
    }

    // Botón de confirmación de logout
    const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
    if (confirmLogoutBtn) {
        confirmLogoutBtn.addEventListener('click', () => {
            utils.cerrarSesion();
        });
    }
});

// Inicialización de la página de exámenes
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado, verificando página de exámenes...');
    
    if (window.location.pathname.endsWith('exams.html')) {
        console.log('Página de exámenes detectada');
        
        // Verificar autenticación
        const usuario = utils.getUsuarioActual();
        console.log('Usuario:', usuario);
        
        if (!usuario.id) {
            console.log('Usuario no autenticado, redirigiendo...');
            window.location.href = 'index.html';
            return;
        }

        // Mostrar nombre de usuario y mensaje de bienvenida
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${usuario.username}`;
        }
        


        // Actualizar mensaje de bienvenida en la página de exámenes
        const welcomePageMessage = document.getElementById('welcome-message');
        if (welcomePageMessage) {
            welcomePageMessage.innerHTML = `¡Hola <strong>${usuario.username}</strong>! 🎯<br>Selecciona una certificación para evaluar tus conocimientos técnicos`;
        }

        // Mostrar mensaje de bienvenida mejorado
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.innerHTML = `
            <div style="display: flex; align-items: center; gap: 1rem;">
                <div style="font-size: 2rem;">👋</div>
                <div>
                    <h4 style="margin: 0; color: #28a745;">¡Bienvenido/a de vuelta!</h4>
                    <p style="margin: 0; opacity: 0.9;">Hola <strong>${usuario.username}</strong>, ¿qué examen tomarás hoy?</p>
                </div>
            </div>
        `;
        welcomeMessage.style.cssText = `
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            text-align: center;
            font-weight: 600;
            margin-bottom: 2rem;
            box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
            animation: slideDown 0.5s ease-out;
        `;
        
        // Insertar mensaje antes del container
        const mainContainer = document.querySelector('.container');
        if (mainContainer) {
            mainContainer.parentNode.insertBefore(welcomeMessage, mainContainer);
            
            // Ocultar mensaje después de 3 segundos
            setTimeout(() => {
                welcomeMessage.style.animation = 'slideUp 0.5s ease-out';
                setTimeout(() => {
                    welcomeMessage.remove();
                }, 500);
            }, 3000);
        }

        // Configurar logout
        const logoutBtnExams = document.getElementById('logoutBtn');
        if (logoutBtnExams) {
            logoutBtnExams.addEventListener('click', function(e) {
                e.preventDefault();
                const modal = document.getElementById('logoutConfirmModal');
                if (modal) {
                    modal.style.display = 'block';
                } else {
                    utils.cerrarSesion();
                }
            });
        }
        
        const confirmLogoutBtnExams = document.getElementById('confirmLogoutBtn');
        if (confirmLogoutBtnExams) {
            confirmLogoutBtnExams.addEventListener('click', () => {
                utils.cerrarSesion();
            });
        }

        // Cargar exámenes de forma síncrona y directa
        const examsContainer = document.querySelector('.exams-list');
        console.log('Container encontrado:', examsContainer);
        
        if (examsContainer) {
            examsContainer.className = 'exams-grid';
            examsContainer.innerHTML = ''; // Limpiar contenido
            
            console.log('Cargando exámenes:', exams.length);
            
            exams.forEach((exam, index) => {
                console.log('Creando examen:', exam.id);
                
                const div = document.createElement('div');
                div.className = 'exam-card';
                div.innerHTML = `
                    <h3>${exam.nombre}</h3>
                    <p>${exam.descripcion}</p>
                    <div class="exam-details">
                        <div class="exam-detail">
                            <span>${exam.preguntas}</span>
                            <small>Preguntas</small>
                        </div>
                        <div class="exam-detail">
                            <span>${exam.tiempo}s</span>
                            <small>Tiempo</small>
                        </div>
                        <div class="exam-detail">
                            <span>${exam.dificultad}</span>
                            <small>Dificultad</small>
                        </div>
                    </div>
                    <button class="btn-exam" onclick="window.location.href='exam.html?exam=${exam.id}'">Rendir examen</button>
                `;
                examsContainer.appendChild(div);
                console.log('Examen añadido:', exam.id);
            });
            
            console.log('Todos los exámenes cargados');
        } else {
            console.error('No se encontró el container .exams-list');
        }
    }
});

// Manejo del examen
document.addEventListener('DOMContentLoaded', function() {
    if (window.location.pathname.endsWith('exam.html')) {
        console.log('Página de examen individual detectada');
        
        const usuario = utils.getUsuarioActual();
        console.log('Usuario:', usuario);
        
        if (!usuario.id) {
            console.log('Usuario no autenticado, redirigiendo...');
            window.location.href = 'index.html';
            return;
        }

        // Mostrar nombre de usuario
        const usernameDisplay = document.getElementById('username-display');
        if (usernameDisplay) {
            usernameDisplay.innerHTML = `<i class="fas fa-user-circle"></i> ${usuario.username}`;
        }

        const params = new URLSearchParams(window.location.search);
        const examId = params.get('exam');
        console.log('ID del examen:', examId);
        
        const examData = exams.find(exam => exam.id === examId);
        console.log('Datos del examen:', examData);
        
        if (!examData) {
            console.error('Examen no encontrado:', examId);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = 'Examen no encontrado';
            return;
        }

        // Verificar que existan preguntas
        const questions = examQuestions[examId];
        if (!questions || questions.length === 0) {
            console.error('No hay preguntas para el examen:', examId);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = 'No hay preguntas disponibles para este examen';
            return;
        }

        // Configurar examen
        document.getElementById('exam-title').textContent = examData.nombre;
        document.getElementById('exam-description').textContent = examData.descripcion;
        
        let currentQuestion = 0;
        let answers = {};
        let timeLeft = examData.tiempo;
        let timerInterval;

        console.log('Configurando examen con', questions.length, 'preguntas y', timeLeft, 'segundos');

        // Iniciar temporizador
        function startTimer() {
            const timerEl = document.getElementById('timer');
            if (!timerEl) {
                console.error('Elemento timer no encontrado');
                return;
            }
            
            console.log('Iniciando temporizador con', timeLeft, 'segundos');
            
            // Mostrar tiempo inicial
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                
                if (timeLeft <= 30) {
                    timerEl.classList.add('warning');
                }
                
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    console.log('Tiempo agotado, enviando examen automáticamente');
                    submitExam();
                }
            }, 1000);
        }

        // Mostrar pregunta actual
        function showQuestion() {
            const question = questions[currentQuestion];
            const container = document.getElementById('exam-content');
            
            container.innerHTML = `
                <div class="question-card active">
                    <div class="question-number">Pregunta ${currentQuestion + 1} de ${questions.length}</div>
                    <div class="question-text">${question.q}</div>
                    <div class="options">
                        ${question.o.map((option, index) => `
                            <div class="option ${answers[currentQuestion] === index ? 'selected' : ''}" onclick="selectOption(${index})">
                                <input type="radio" name="question${currentQuestion}" value="${index}" ${answers[currentQuestion] === index ? 'checked' : ''}>
                                <span class="option-label">${option}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
            
            updateProgress();
            updateNavigation();
        }

        // Seleccionar opción
        window.selectOption = function(index) {
            console.log('Seleccionando opción', index, 'para la pregunta', currentQuestion);
            answers[currentQuestion] = index;
            showQuestion();
        };

        // Actualizar progreso
        function updateProgress() {
            const progressEl = document.getElementById('progress');
            progressEl.innerHTML = questions.map((_, index) => `
                <div class="progress-dot ${index < currentQuestion ? 'completed' : ''} ${index === currentQuestion ? 'active' : ''}"></div>
            `).join('');
        }

        // Actualizar navegación
        function updateNavigation() {
            const prevBtn = document.getElementById('prev-btn');
            const nextBtn = document.getElementById('next-btn');
            const submitBtn = document.getElementById('submit-btn');
            
            if (!prevBtn || !nextBtn || !submitBtn) {
                console.error('Botones de navegación no encontrados');
                return;
            }
            
            prevBtn.disabled = currentQuestion === 0;
            
            if (currentQuestion === questions.length - 1) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'block';
            } else {
                nextBtn.style.display = 'block';
                submitBtn.style.display = 'none';
            }
        }

        // Navegación
        window.previousQuestion = function() {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
                console.log('Navegando a la pregunta anterior:', currentQuestion + 1);
            } else {
                console.log('Ya estás en la primera pregunta');
            }
        };

        window.nextQuestion = function() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
                console.log('Navegando a la siguiente pregunta:', currentQuestion + 1);
            } else {
                console.log('Ya estás en la última pregunta');
            }
        };

        // Enviar examen
        window.submitExam = async function() {
            console.log('Iniciando envío del examen...');
            clearInterval(timerInterval);
            
            // Validar que todas las preguntas tengan respuesta
            let unansweredQuestions = [];
            questions.forEach((question, index) => {
                if (answers[index] === undefined || answers[index] === null || answers[index] === '') {
                    unansweredQuestions.push(index + 1);
                }
            });
            
            if (unansweredQuestions.length > 0) {
                const confirmSubmit = confirm(`Tienes preguntas sin responder: ${unansweredQuestions.join(', ')}\n\n¿Deseas enviar el examen de todas formas?`);
                if (!confirmSubmit) {
                    return;
                }
            }
            
            // Calcular puntuación
            let correct = 0;
            questions.forEach((question, index) => {
                if (answers[index] === question.a) {
                    correct++;
                }
            });
            
            const score = Math.round((correct / questions.length) * 100);
            console.log('Puntuación calculada:', score, 'correctas:', correct, 'de', questions.length);
            
            try {
                // Guardar resultado del examen
                await examenes.guardarResultado(examId, score);
                
                // Guardar resultados en sessionStorage para result.html
                const resultadoCompleto = {
                    exam: examId,
                    score: score,
                    correct: correct,
                    total: questions.length,
                    answers: answers,
                    questions: questions
                };
                sessionStorage.setItem('certiweb_last_result', JSON.stringify(resultadoCompleto));
                
                // Si aprobó (60% o más), crear certificado automáticamente
                if (score >= 60) {
                    try {
                        await examenes.crearCertificado(usuario.id, examId);
                        console.log('Certificado creado automáticamente');
                    } catch (certError) {
                        console.error('Error creando certificado:', certError);
                        // No fallamos el proceso si el certificado falla
                    }
                }
                
                window.location.href = `result.html?exam=${examId}&score=${score}&correct=${correct}&total=${questions.length}`;
            } catch (error) {
                console.error('Error guardando resultado:', error);
                alert('Error al guardar el resultado. Por favor intenta nuevamente.');
            }
        };

        // Iniciar examen
        document.getElementById('loading').style.display = 'none';
        document.getElementById('exam-content').style.display = 'block';
        document.getElementById('navigation').style.display = 'flex';
        
        console.log('Iniciando examen...');
        showQuestion();
        
        // Iniciar el temporizador
        startTimer();
        console.log('Temporizador iniciado con', timeLeft, 'segundos');
    }
});

// --- RESULTADO Y CERTIFICADO PDF ---
if (window.location.pathname.endsWith('result.html')) {
    const usuario = utils.getUsuarioActual();
    if (!usuario || !usuario.username) window.location.href = 'index.html';
    const result = JSON.parse(sessionStorage.getItem('certiweb_last_result') || 'null');
    const section = document.getElementById('result-section');
    if (!result) {
        section.innerHTML = '<p>No hay resultado para mostrar.</p>';
    } else {
        const aprobado = result.score >= 60;
        const examId = result.exam;
        section.innerHTML = `
            <div class="result-card" style="text-align: center; background: var(--bg-card); padding: 4rem 2rem; border-radius: 20px; border: 1px solid rgba(0, 243, 255, 0.3); box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 20px rgba(0, 243, 255, 0.05); max-width: 700px; margin: 0 auto; position: relative; overflow: hidden;">
                <!-- Fondo decorativo -->
                <div style="position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'}; opacity: 0.1; filter: blur(50px); border-radius: 50%;"></div>
                
                <h2 style="color: var(--text-main); margin-bottom: 2.5rem; font-size: 2.2rem; font-weight: 700; text-transform: uppercase; letter-spacing: 2px;">Resultado del examen</h2>
                
                <div style="margin: 2rem auto; width: 150px; height: 150px; border-radius: 50%; border: 4px solid ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'}; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 30px ${aprobado ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,102,0.2)'}, inset 0 0 20px ${aprobado ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,102,0.2)'}; background: rgba(15, 23, 42, 0.8);">
                    <span style="font-size: 3.5rem; font-weight: 800; color: ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'}; text-shadow: 0 0 15px ${aprobado ? 'rgba(0,255,136,0.5)' : 'rgba(255,51,102,0.5)'};">${result.score}%</span>
                </div>
                
                <div style="font-size: 1.2rem; margin-bottom: 1.5rem; color: var(--text-muted);">
                    <i class="fas fa-check-circle" style="color: var(--neon-cyan); margin-right: 5px;"></i> ${result.correct} de ${result.total} preguntas correctas
                </div>
                
                <p style="font-size: 1.4rem; font-weight: 500; margin-bottom: 3rem; color: ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'};">
                    ${aprobado ? '🎉 ¡Felicidades, has aprobado la certificación con éxito!' : '❌ No alcanzaste el puntaje mínimo requerido para aprobar.'}
                </p>
                
                <div class="result-buttons" style="display: flex; gap: 1.5rem; justify-content: center; flex-wrap: wrap; margin-top: 1.5rem;">
                    <a href='exams.html' class='btn-nav' style="padding: 1rem 2rem; display: flex; align-items: center; gap: 8px;"><i class="fas fa-arrow-left"></i> Volver a exámenes</a>
                    <button id='verRespuestas' class='btn-exam' style="padding: 1rem 2rem; width: auto; display: flex; align-items: center; gap: 8px; background: rgba(176, 38, 255, 0.1);"><i class="fas fa-list-check"></i> Ver respuestas</button>
                    ${aprobado ? `
                        <button id='descargarPDF' class='btn-submit' style="padding: 1rem 2rem; margin: 0; display: flex; align-items: center; gap: 8px; background: var(--neon-green); box-shadow: 0 0 15px rgba(0, 255, 136, 0.4); color: #000;"><i class="fas fa-download"></i> Descargar PDF</button>
                        <a href="https://www.linkedin.com/sharing/share-offsite/?url=https://certiwebs-backend.onrender.com" target="_blank" class="btn-nav btn-share-linkedin" style="padding: 1rem 2rem; display: flex; align-items: center; gap: 8px; border-color: #0077b5; color: #0077b5;" onmouseover="this.style.background='rgba(0, 119, 181, 0.1)';" onmouseout="this.style.background='transparent';"><i class="fab fa-linkedin"></i> LinkedIn</a>
                        <a href="https://twitter.com/intent/tweet?text=¡He%20aprobado%20mi%20certificación%20de%20${result.exam.toUpperCase()}%20en%20CertiWebs!%20%F0%9F%8E%93" target="_blank" class="btn-nav btn-share-twitter" style="padding: 1rem 2rem; display: flex; align-items: center; gap: 8px; border-color: #1da1f2; color: #1da1f2;" onmouseover="this.style.background='rgba(29, 161, 242, 0.1)';" onmouseout="this.style.background='transparent';"><i class="fab fa-twitter"></i> Twitter / X</a>
                    ` : ''}
                </div>
            </div>`;
            
        document.getElementById('verRespuestas').onclick = function () {
            let html = `
                <div class="review-section" style="max-width: 800px; margin: 0 auto; animation: fadeIn 0.4s ease;">
                    <h2 style="color: var(--neon-purple); text-align: center; margin-bottom: 2rem; text-shadow: 0 0 10px rgba(176, 38, 255, 0.3);">Revisión de respuestas</h2>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            `;
            const questions = result.questions || examQuestions[examId];
            questions.forEach((question, i) => {
                const a = result.answers[i];
                const isCorrect = a === question.a;
                const borderColor = isCorrect ? 'var(--neon-green)' : 'var(--neon-red)';
                const bgLight = isCorrect ? 'rgba(0, 255, 136, 0.05)' : 'rgba(255, 51, 102, 0.05)';
                
                html += `
                    <div style="background: ${bgLight}; border-left: 4px solid ${borderColor}; padding: 1.5rem; border-radius: 8px;">
                        <h4 style="color: #fff; margin-bottom: 1rem; font-weight: 500;">${i + 1}. ${questions[i].q}</h4>
                        <p style="margin-bottom: 0.5rem; color: ${isCorrect ? 'var(--neon-green)' : 'var(--neon-red)'}; font-size: 1.1rem;">
                            <b>Tu respuesta:</b> ${questions[i].o[a] || 'Sin respuesta'} ${isCorrect ? '✓' : '✗'}
                        </p>
                        ${!isCorrect ? `<p style="margin-bottom: 1rem; color: var(--neon-green); font-size: 1.1rem;"><b>Respuesta correcta:</b> ${questions[i].o[questions[i].a]}</p>` : ''}
                        
                        <div style="margin-top: 1rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
                            <p style="margin-bottom: 0; color: #a0aec0; font-size: 1rem;">
                                <i class="fas fa-info-circle" style="color: var(--neon-cyan); margin-right: 5px;"></i>
                                <b>Explicación:</b> ${questions[i].expl || 'Justificación no disponible.'}
                            </p>
                        </div>
                    </div>
                `;
            });
            html += `
                    </div>
                    <div style="text-align: center; margin-top: 3rem;">
                        <a href="result.html" class="btn-principal" style="background: transparent; color: var(--neon-cyan); border: 1px solid var(--neon-cyan); box-shadow: none;">Volver al resultado</a>
                    </div>
                </div>`;
            section.innerHTML = html;
        };
        
        if (aprobado) {
            document.getElementById('descargarPDF').onclick = async function () {
                try {
                    const { jsPDF } = window.jspdf;
                    const doc = new jsPDF();
                    
                    // Fondo
                    doc.setFillColor(15, 23, 42); // bg-dark
                    doc.rect(0, 0, 210, 297, 'F');
                    
                    // Borde
                    doc.setDrawColor(0, 243, 255); // neon-cyan
                    doc.setLineWidth(1);
                    doc.rect(10, 10, 190, 277);
                    
                    doc.setTextColor(0, 243, 255);
                    doc.setFontSize(28);
                    doc.text('Certificado de Aprobación', 105, 60, { align: 'center' });
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(16);
                    doc.text('Otorgado por CertiWebs a:', 105, 100, { align: 'center' });
                    
                    doc.setTextColor(0, 255, 136); // neon-green
                    doc.setFontSize(24);
                    doc.text(`${usuario.username}`, 105, 120, { align: 'center' });
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(14);
                    doc.text(`Por haber aprobado con éxito la certificación en:`, 105, 150, { align: 'center' });
                    
                    doc.setTextColor(176, 38, 255); // neon-purple
                    doc.setFontSize(20);
                    doc.text(`${examId.toUpperCase()}`, 105, 170, { align: 'center' });
                    
                    doc.setTextColor(255, 255, 255);
                    doc.setFontSize(14);
                    doc.text(`Con una puntuación de: ${result.score}%`, 105, 200, { align: 'center' });
                    
                    const fecha = new Date().toLocaleDateString();
                    doc.text(`Fecha de emisión: ${fecha}`, 105, 220, { align: 'center' });
                    
                    doc.save(`certificado_${examId}_${usuario.username}.pdf`);
                } catch(e) {
                    alert('Error generando PDF: ' + e.message);
                }
            };
        }
    };
}

// --- RESPONSIVE HAMBURGER MENU ---
document.addEventListener('DOMContentLoaded', () => {
    const nav = document.querySelector('nav');
    if (!nav) return;

    // Check if toggle button already exists
    if (document.querySelector('.menu-toggle')) return;

    // Create mobile hamburger button
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.setAttribute('aria-label', 'Menú de navegación');
    toggleBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    const navLinks = nav.querySelector('.nav-links');
    if (navLinks) {
        nav.insertBefore(toggleBtn, navLinks);
        
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
    }
});

// --- DYNAMIC TABLE OF CONTENTS (ÍNDICE) FOR STUDY GUIDES ---
document.addEventListener('DOMContentLoaded', () => {
    // Only run on study guide pages
    if (!window.location.pathname.includes('study-')) return;

    const guideGrid = document.querySelector('.guide-grid');
    if (!guideGrid) return;

    const headings = guideGrid.querySelectorAll('.guide-card h2');
    if (headings.length === 0) return;

    // Create TOC container
    const tocCard = document.createElement('div');
    tocCard.className = 'toc-card';

    const tocTitle = document.createElement('h3');
    tocTitle.className = 'toc-title';
    tocTitle.innerHTML = '<i class="fas fa-list-ol"></i> Índice de Contenidos';
    tocCard.appendChild(tocTitle);

    const tocList = document.createElement('ul');
    tocList.className = 'toc-list';

    headings.forEach((h2, index) => {
        const id = `seccion-${index + 1}`;
        h2.id = id; // Set id on heading for anchor link

        let titleText = h2.textContent.trim();
        
        const li = document.createElement('li');
        li.className = 'toc-item';
        
        const originalIcon = h2.querySelector('i');
        const iconHTML = originalIcon ? originalIcon.outerHTML : '<i class="fas fa-chevron-right"></i>';

        li.innerHTML = `<a href="#${id}">${iconHTML} ${titleText}</a>`;
        tocList.appendChild(li);
    });

    tocCard.appendChild(tocList);

    // Insert TOC card at the very beginning of the guide grid
    guideGrid.insertBefore(tocCard, guideGrid.firstChild);
});

// --- BOLETÍN DE NOVEDADES (NEWSLETTER) HANDLER ---
document.addEventListener('DOMContentLoaded', () => {
    const newsForm = document.getElementById('newsletter-form');
    if (!newsForm) return;

    newsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const emailInput = document.getElementById('newsletter-email');
        const statusEl = document.getElementById('newsletter-status');
        if (!emailInput || !statusEl) return;

        const email = emailInput.value.trim();
        statusEl.textContent = 'Enviando suscripción...';
        statusEl.className = 'status-info';
        statusEl.style.color = 'var(--neon-cyan)';
        statusEl.style.display = 'block';

        try {
            const data = await utils.fetchAPI('newsletter', {
                method: 'POST',
                body: JSON.stringify({ email })
            });

            statusEl.textContent = data.mensaje || '¡Suscripción exitosa!';
            statusEl.className = 'status-success';
            statusEl.style.color = 'var(--neon-green)';
            emailInput.value = '';
        } catch (error) {
            statusEl.textContent = error.message || 'Error al procesar la suscripción.';
            statusEl.className = 'status-error';
            statusEl.style.color = 'var(--neon-red)';
        }
    });
});


