// --- Funcionalidad básica para el formulario de contacto (solo si existe) ---
// Este código será reemplazado por la versión más completa más abajo

// Login/registro manejados más abajo con llamadas al API (evitar lógica simulada)

// Logout manejado en DOMContentLoaded usando sessionStorage

// --- EXÁMENES DISPONIBLES (HTML, CSS, JS, Redes, SO) ---
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
        { q: '¿Qué significa HTML?', o: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], a: 0 },
        { q: '¿Cuál es la etiqueta correcta para un salto de línea en HTML?', o: ['&lt;br&gt;', '&lt;lb&gt;', '&lt;break&gt;'], a: 0 },
        { q: '¿Qué atributo se usa para especificar un enlace?', o: ['src', 'href', 'link'], a: 1 },
        { q: '¿Cuál es la etiqueta principal que engloba todo el documento HTML?', o: ['&lt;main&gt;', '&lt;body&gt;', '&lt;html&gt;'], a: 2 },
        { q: '¿Qué extensión puede tener un archivo HTML?', o: ['.htm', '.html', 'Ambas'], a: 2 }
    ],
    css: [
        { q: '¿Qué significa CSS?', o: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Syntax'], a: 0 },
        { q: '¿Cómo se selecciona una clase en CSS?', o: ['#clase', '.clase', 'clase'], a: 1 },
        { q: '¿Cuál es la propiedad para cambiar el color de fondo?', o: ['background-color', 'color', 'bgcolor'], a: 0 },
        { q: '¿Qué unidad es relativa al tamaño de fuente?', o: ['px', 'em', '%'], a: 1 },
        {
            q: '¿Cómo se comenta en CSS?', o: [
                '<span class="code-option">/* comentario */</span>',
                '<span class="code-option">// comentario</span>',
                '<span class="code-option">&lt;!-- comentario --&gt;</span>'
            ], a: 0
        }
    ],
    js: [
        { q: '¿Qué tipo de lenguaje es JavaScript?', o: ['Compilado', 'Interpretado', 'Ambos'], a: 1 },
        { q: '¿Cómo se declara una variable?', o: ['var x;', 'int x;', 'let x = 0;'], a: 0 },
        { q: '¿Qué método muestra un mensaje en pantalla?', o: ['alert()', 'print()', 'show()'], a: 0 },
        { q: '¿Cuál NO es un tipo de dato en JS?', o: ['string', 'float', 'boolean'], a: 1 },
        {
            q: '¿Cómo se escribe un comentario de una línea?', o: [
                '<span class="code-option">// comentario</span>',
                '<span class="code-option">/* comentario */</span>',
                '<span class="code-option">&lt;!-- comentario --&gt;</span>'
            ], a: 0
        }
    ],
    redes: [
        { q: '¿Qué es una dirección IP?', o: ['Un identificador de red', 'Un protocolo', 'Un tipo de cable'], a: 0 },
        { q: '¿Qué puerto usa HTTP?', o: ['21', '80', '443'], a: 1 },
        { q: '¿Qué significa LAN?', o: ['Large Area Network', 'Local Area Network', 'Light Area Network'], a: 1 },
        { q: '¿Qué dispositivo conecta redes diferentes?', o: ['Switch', 'Router', 'Hub'], a: 1 },
        { q: '¿Qué protocolo asigna IP automáticamente?', o: ['DNS', 'DHCP', 'FTP'], a: 1 }
    ],
    so: [
        { q: '¿Qué es un sistema operativo?', o: ['Un programa de aplicación', 'Un software de sistema', 'Un hardware'], a: 1 },
        { q: '¿Cuál NO es un sistema operativo?', o: ['Linux', 'Windows', 'HTML'], a: 2 },
        { q: '¿Qué comando muestra archivos en Linux?', o: ['ls', 'cd', 'pwd'], a: 0 },
        { q: '¿Qué es un proceso?', o: ['Un programa en ejecución', 'Un archivo', 'Un usuario'], a: 0 },
        { q: 'Qué sistema operativo es de código abierto?', o: ['Windows', 'Linux', 'macOS'], a: 1 }
    ]
};

// Configuración de la API
const API_URL = 'http://localhost:3000/api';

// Utilidades
const utils = {
    async fetchAPI(endpoint, options = {}) {
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                }
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Error en la petición');
            return data;
        } catch (error) {
            console.error('Error API:', error);
            throw error;
        }
    },

    getUsuarioActual() {
        return {
            id: sessionStorage.getItem('userId'),
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
            elemento.className = `mensaje-${tipo}`;
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
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();
            
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

    // Función para inicializar el formulario de login cuando se abra el modal
    function initializeLoginForm() {
        const loginForm = document.getElementById('login-form');
        console.log('Formulario login encontrado:', loginForm);
        
        if (loginForm && !loginForm.hasAttribute('data-initialized')) {
            loginForm.addEventListener('submit', async (e) => {
                console.log('Submit de login activado');
                e.preventDefault();
                
                const username = document.getElementById('login-username').value.trim();
                const password = document.getElementById('login-password').value;
                const msgElement = loginForm.querySelector('.login-msg');
                
                console.log('Intentando login con usuario:', username);
                console.log('Password length:', password.length);
                console.log('API URL:', API_URL);

                try {
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ username, password })
                    });
                    
                    console.log('Response status:', response.status);
                    const data = await response.json();
                    console.log('Response data:', data);
                    
                    if (response.ok) {
                        console.log('Login exitoso');
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('username', data.username);
                        sessionStorage.setItem('userId', data.id);
                        
                        // Mostrar mensaje de éxito personalizado
                        if (msgElement) {
                            msgElement.innerHTML = `¡Bienvenido/a <strong>${data.username}</strong>! 🎉<br>Sesión iniciada correctamente. Redirigiendo...`;
                            msgElement.className = 'login-msg success-message';
                        } else {
                            alert(`¡Bienvenido/a ${data.username}! 🎉\nSesión iniciada correctamente.`);
                        }
                        
                        // Redirigir inmediatamente
                        console.log('Redirigiendo a exams.html...');
                        
                        // Cerrar modal primero
                        const loginModal = document.getElementById('loginModal');
                        if (loginModal) {
                            loginModal.style.display = 'none';
                        }
                        
                        // Redirigir con más tiempo y usando window.location.replace
                        setTimeout(() => {
                            console.log('Ejecutando redirección...');
                            window.location.replace('exams.html');
                        }, 1000);
                    } else {
                        console.log('Login fallido:', data.error);
                        if (msgElement) {
                            msgElement.textContent = data.error || 'Error al iniciar sesión';
                            msgElement.className = 'login-msg error-message';
                        } else {
                            alert(data.error || 'Error al iniciar sesión');
                        }
                    }
                } catch (error) {
                    console.error('Error en login:', error);
                    if (msgElement) {
                        msgElement.textContent = 'Error de conexión. Intenta nuevamente.';
                        msgElement.className = 'login-msg error-message';
                    } else {
                        alert('Error de conexión. Intenta nuevamente.');
                    }
                }
            });
            
            loginForm.setAttribute('data-initialized', 'true');
            console.log('Formulario de login inicializado correctamente');
        } else {
            console.log('Formulario de login no encontrado o ya inicializado');
        }
    }

    // Inicializar formulario cuando se abra el modal de login
    const loginModal = document.getElementById('loginModal');
    if (loginModal) {
        // Intentar inicializar inmediatamente
        initializeLoginForm();
        
        // También observar cambios en el modal
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
                    if (loginModal.style.display === 'block') {
                        initializeLoginForm();
                    }
                }
            });
        });
        observer.observe(loginModal, { attributes: true });
        
        // También intentar inicializar cuando se haga clic en el botón de login
        const loginBtn = document.querySelector('[onclick*="loginModal"]');
        if (loginBtn) {
            loginBtn.addEventListener('click', () => {
                setTimeout(initializeLoginForm, 100);
            });
        }
    }

    // Formulario de registro
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value;
            const email = document.getElementById('register-email').value;
            const msgElement = registerForm.querySelector('.register-msg');

            try {
                // Intentar registrar el usuario
                const data = await utils.fetchAPI('registro', {
                    method: 'POST',
                    body: JSON.stringify({ username, password, email })
                });
                
                // Si el registro es exitoso, guardar datos de sesión
                sessionStorage.setItem('token', data.token);
                sessionStorage.setItem('username', data.username);
                sessionStorage.setItem('userId', data.id);
                
                utils.mostrarMensaje(msgElement, '¡Registro exitoso! Iniciando sesión...', 'success');
                
                // Redirigir a la página de exámenes después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'exams.html';
                }, 1500);
                
            } catch (error) {
                // Si el usuario ya existe, mostrar mensaje para que inicie sesión
                if (error.message.includes('ya existe') || error.message.includes('duplicate')) {
                    utils.mostrarMensaje(msgElement, 'Este usuario ya está registrado. Por favor inicia sesión.', 'error');
                    // Cerrar modal de registro y abrir modal de login
                    setTimeout(() => {
                        const registerModal = document.getElementById('registerModal');
                        const loginModal = document.getElementById('loginModal');
                        if (registerModal) registerModal.style.display = 'none';
                        if (loginModal) {
                            loginModal.style.display = 'block';
                            initializeLoginForm(); // Inicializar formulario de login
                        }
                    }, 2000);
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
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function() {
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
                <div class="question-card ${currentQuestion === 0 ? 'active' : ''}">
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
                <div class="progress-dot ${index < currentQuestion ? 'completed' : ''} ${index === currentQuestion ? 'current' : ''}"></div>
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
        section.innerHTML = `<h2>Resultado del examen</h2>
            <p><b>Puntaje:</b> ${result.score}% (${result.correct} de ${result.total} correctas)</p>
            <p>${aprobado ? '¡Felicidades, aprobaste!' : 'No alcanzaste el puntaje mínimo.'}</p>
            <button id='verRespuestas'>Ver respuestas</button>
            ${aprobado ? "<button id='descargarPDF'>Descargar certificado PDF</button>" : ''}
            <a href='exams.html' class='btn-principal'>Volver a exámenes</a>`;
        document.getElementById('verRespuestas').onclick = function () {
            let html = '<h3>Revisión de respuestas</h3><ol>';
            const examId = result.exam;
            const questions = examQuestions[examId];
            result.answers.forEach((a, i) => {
                html += `<li>${questions[i].q}<br>Tu respuesta: <b>${questions[i].o[a] || 'Sin respuesta'}</b><br>Correcta: <b>${questions[i].o[questions[i].a]}</b></li>`;
            });
            html += '</ol><a href="result.html" class="btn-principal">Volver</a>';
            section.innerHTML = html;
        };
        if (aprobado) {
            document.getElementById('descargarPDF').onclick = async function () {
                const { jsPDF } = window.jspdf;
                const doc = new jsPDF();
                doc.setFontSize(20);
                doc.text('Certificado de Aprobación', 105, 50, { align: 'center' });
                doc.setFontSize(14);
                doc.text(`Examen: ${examId.toUpperCase()}`, 105, 70, { align: 'center' });
                doc.text(`Puntaje: ${result.score}%`, 105, 85, { align: 'center' });
                doc.text(`Usuario: ${usuario.username}`, 105, 100, { align: 'center' });
                doc.save(`certificado_${examId}_${usuario.username}.pdf`);
            };
        }
    };
}


