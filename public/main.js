// --- Funcionalidad básica para el formulario de contacto (solo si existe) ---
const contactoForm = document.getElementById('contacto-form');
if (contactoForm) {
    contactoForm.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Nos pondremos en contacto pronto.');
        this.reset();
    });
}

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
            id: sessionStorage.getItem('certiweb_user_id'),
            username: sessionStorage.getItem('certiweb_username')
        };
    },

    setUsuarioActual(id, username) {
        sessionStorage.setItem('certiweb_user_id', id);
        sessionStorage.setItem('certiweb_username', username);
    },

    cerrarSesion() {
        sessionStorage.removeItem('certiweb_user_id');
        sessionStorage.removeItem('certiweb_username');
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
        contactoForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const statusEl = document.getElementById('contact-status');
            const name = document.getElementById('contact-name').value.trim();
            const email = document.getElementById('contact-email').value.trim();
            const subject = document.getElementById('contact-subject').value.trim();
            const message = document.getElementById('contact-message').value.trim();

            statusEl.textContent = 'Enviando...';
            statusEl.className = 'status-message';
            document.getElementById('contact-submit').disabled = true;

            try {
                const resp = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, subject, message })
                });
                const data = await resp.json();
                if (!resp.ok) throw new Error(data.error || 'Error en el servidor');
                
                statusEl.textContent = '¡Mensaje enviado correctamente! Te responderemos a la brevedad.';
                statusEl.className = 'status-message status-success';
                contactoForm.reset();
                
                // Redirigir después de 3 segundos
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 3000);
                
            } catch (err) {
                console.error('Contacto error:', err);
                statusEl.textContent = 'Hubo un error al enviar. Por favor, intenta más tarde.';
                statusEl.className = 'status-message status-error';
            } finally {
                document.getElementById('contact-submit').disabled = false;
            }
        });
    }

    // Formulario de login
    const loginForm = document.getElementById('login-form');
    console.log('Formulario login encontrado:', loginForm);
    
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            console.log('Submit de login activado');
            e.preventDefault();
            
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            const msgElement = loginForm.querySelector('.login-msg');
            
            console.log('Intentando login con usuario:', username);
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
                
                if (!response.ok) {
                    throw new Error(data.error || 'Error en el login');
                }
                
                utils.setUsuarioActual(data.id, data.username);
                
                // Mostrar mensaje de éxito
                if (msgElement) {
                    msgElement.textContent = `¡Bienvenido ${username}! Iniciando sesión...`;
                    msgElement.className = 'login-msg success-message';
                }
                
                // Redirigir después de 1.5 segundos
                setTimeout(() => {
                    window.location.href = 'exams.html';
                }, 1500);
                
            } catch (error) {
                console.error('Error en login:', error);
                if (msgElement) {
                    msgElement.textContent = error.message;
                    msgElement.className = 'login-msg error-message';
                }
            }
        });
    } else {
        console.error('No se encontró el formulario de login');
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
                await auth.registrar(username, password, email);
                utils.mostrarMensaje(msgElement, '¡Registro exitoso! Redirigiendo...', 'success');
                setTimeout(() => window.location.href = 'exams.html', 1500);
            } catch (error) {
                utils.mostrarMensaje(msgElement, error.message);
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
            usernameDisplay.textContent = usuario.username;
        }

        // Mostrar mensaje de bienvenida temporal
        const welcomeMessage = document.createElement('div');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.textContent = `¡Bienvenido/a ${usuario.username}!`;
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
            usernameDisplay.textContent = usuario.username;
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
            }
        };

        window.nextQuestion = function() {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
            }
        };

        // Enviar examen
        window.submitExam = async function() {
            clearInterval(timerInterval);
            
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
        startTimer();
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
                const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

                // Fondo principal
                doc.setFillColor(244, 246, 251); // #f4f6fb
                doc.rect(0, 0, 297, 210, 'F');

                // Borde cuadrado con sombra
                doc.setDrawColor(57, 73, 171); // azul
                doc.setLineWidth(3);
                doc.rect(15, 15, 267, 180, 'S');
                doc.setDrawColor(255, 179, 0); // amarillo
                doc.setLineWidth(1.2);
                doc.rect(20, 20, 257, 170, 'S');

                // Cinta decorativa superior
                doc.setFillColor(57, 73, 171);
                doc.roundedRect(15, 15, 267, 28, 8, 8, 'F');

                // Cinta decorativa inferior
                doc.setFillColor(255, 179, 0);
                doc.roundedRect(15, 167, 267, 28, 8, 8, 'F');

                // Título
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(32);
                doc.setTextColor(255, 255, 255);
                doc.text('Certificado de Aprobación', 148.5, 33, { align: 'center' });

                // Subtítulo
                doc.setFont('helvetica', 'italic');
                doc.setFontSize(16);
                doc.setTextColor(57, 73, 171);
                doc.text('CertiWebs - Universidad Nacional del Litoral', 148.5, 55, { align: 'center' });

                // Nombre del usuario
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(18);
                doc.setTextColor(0, 0, 0);
                doc.text('Otorgado a:', 40, 80);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(24);
                doc.setTextColor(26, 35, 126);
                doc.text(usuario.username, 80, 80);

                // Examen aprobado
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(18);
                doc.setTextColor(0, 0, 0);
                doc.text('Por aprobar el examen de:', 40, 100);

                // NOMBRE DEL EXAMEN DESTACADO
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(28); // más grande
                doc.setTextColor(255, 179, 0); // amarillo institucional
                doc.text(result.exam.toUpperCase(), 148.5, 112, { align: 'center' }); // centrado y más abajo

                // Puntaje
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(18);
                doc.setTextColor(0, 0, 0);
                doc.text('Puntaje obtenido:', 40, 120);
                doc.setFont('helvetica', 'bold');
                doc.setFontSize(20);
                doc.setTextColor(57, 73, 171);
                doc.text(`${result.score}%`, 90, 120);

                // Fecha
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(16);
                doc.setTextColor(0, 0, 0);
                doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 40, 140);

                // Mensaje de felicitación
                doc.setFont('helvetica', 'bolditalic');
                doc.setFontSize(22);
                doc.setTextColor(255, 87, 34);
                doc.text('¡Felicitaciones por tu logro académico!', 148.5, 160, { align: 'center' });

                // Firma digital
                doc.setFont('courier', 'bolditalic');
                doc.setFontSize(18);
                doc.setTextColor(26, 35, 126);
                doc.text('Octavio Ramírez', 210, 185);
                doc.setFont('helvetica', 'normal');
                doc.setFontSize(12);
                doc.setTextColor(0, 0, 0);
                doc.text('Director de CertiWebs', 210, 192);

                // Logo (opcional)
                try {
                    const logo = await fetch('unl-logo.png').then(r => r.blob()).then(blob => new Promise(res => {
                        const reader = new FileReader();
                        reader.onload = () => res(reader.result);
                        reader.readAsDataURL(blob);
                    }));
                    doc.addImage(logo, 'PNG', 230, 25, 45, 45);
                } catch (e) {
                    // Si no hay logo, no pasa nada
                }

                doc.save(`Certificado_${result.exam}_${usuario.username}.pdf`);
            };
        }
    }
}

// --- Historial de exámenes y ranking ---
if (window.location.pathname.endsWith('exams.html')) {
    const usuario = sessionStorage.getItem('certiweb_username');
    if (usuario) {
        // Mostrar historial del usuario (si existe en localStorage antiguo)
        const hist = JSON.parse(localStorage.getItem('certiweb_hist') || '{}');
        const userHist = hist[usuario] || [];
        if (userHist.length > 0) {
            const histDiv = document.createElement('div');
            histDiv.className = 'mt-4';
            histDiv.innerHTML = `<h4>Historial de exámenes rendidos</h4><ul class='list-group mb-3'>${userHist.map(h => `<li class='list-group-item'>${h.exam.toUpperCase()} - Puntaje: ${h.score}% - ${h.date}</li>`).join('')}</ul>`;
            document.querySelector('.section').appendChild(histDiv);
        }
        // Ranking simple (top 5 puntajes)
        let allScores = [];
        Object.keys(hist).forEach(u => {
            hist[u].forEach(h => {
                allScores.push({ user: u, exam: h.exam, score: h.score, date: h.date });
            });
        });
        if (allScores.length > 0) {
            allScores.sort((a, b) => b.score - a.score);
            const top = allScores.slice(0, 5);
            const rankDiv = document.createElement('div');
            rankDiv.className = 'mt-4';
            rankDiv.innerHTML = `<h4>Ranking de puntajes destacados</h4><ol class='list-group mb-3'>${top.map(r => `<li class='list-group-item'>${r.user} - ${r.exam.toUpperCase()} - ${r.score}%</li>`).join('')}</ol>`;
            document.querySelector('.section').appendChild(rankDiv);
        }
    }
}

