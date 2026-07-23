// --- Control del Menú Móvil Hamburger ---
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    const menuIcon = document.querySelector('#menuToggleBtn i');
    if (navLinks) {
        navLinks.classList.toggle('active');
        if (menuIcon) {
            if (navLinks.classList.contains('active')) {
                menuIcon.className = 'fas fa-times'; // Cruz de cerrar
            } else {
                menuIcon.className = 'fas fa-bars'; // Icono hamburguesa
            }
        }
    }
}

// --- Funcionalidad básica para el formulario de contacto (solo si existe) ---
// Este código será reemplazado por la versión más completa más abajo

// Login/registro manejados más abajo con llamadas al API (evitar lógica simulada)

// Logout manejado en DOMContentLoaded usando sessionStorage

// --- EXÁMENES DISPONIBLES (HTML, CSS, JS, Redes, SO) ---
// --- EXÁMENES DISPONIBLES (HTML, CSS, JS, Redes, SO) ---
const exams = [
    {
        id: 'html',
        nombre: 'HTML Básico',
        descripcion: 'Evalúa tus conocimientos sobre HTML y estructura web.',
        preguntas: 5,
        tiempo: 150,
        dificultad: 'Fácil'
    },
    {
        id: 'css',
        nombre: 'CSS Básico',
        descripcion: 'Conceptos básicos de estilos y selectores CSS.',
        preguntas: 5,
        tiempo: 150,
        dificultad: 'Fácil'
    },
    {
        id: 'js',
        nombre: 'JavaScript Básico',
        descripcion: 'Fundamentos de programación en JavaScript.',
        preguntas: 5,
        tiempo: 200,
        dificultad: 'Fácil'
    },
    {
        id: 'redes',
        nombre: 'Redes',
        descripcion: 'Conceptos básicos de redes y protocolos.',
        preguntas: 5,
        tiempo: 180,
        dificultad: 'Media'
    },
    {
        id: 'so',
        nombre: 'Sistemas Operativos',
        descripcion: 'Preguntas sobre sistemas operativos y comandos.',
        preguntas: 5,
        tiempo: 180,
        dificultad: 'Media'
    }
];

// Nota: la carga de exámenes y control de acceso se realiza en la sección que
// comprueba `window.location.pathname.endsWith('exams.html')` más abajo, usando
// la sesión del usuario porporcionada por el backend.

// --- PREGUNTAS DE EXAMEN Y LÓGICA DE RENDICIÓN ---
const examQuestions = {
    html: [
        { q: '¿Qué significa HTML?', o: ['HyperText Markup Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'], a: 0, exp: 'HTML significa HyperText Markup Language (Lenguaje de Marcado de Hipertexto) y es el estándar de estructura para la web.' },
        { q: '¿Etiqueta para salto de línea en HTML?', o: ['&lt;br&gt;', '&lt;lb&gt;', '&lt;break&gt;'], a: 0, exp: 'La etiqueta &lt;br&gt; produce un salto de línea sin iniciar un nuevo párrafo.' },
        { q: '¿Qué atributo especifica un enlace?', o: ['src', 'href', 'link'], a: 1, exp: 'El atributo href (Hypertext Reference) indica el destino del enlace en una etiqueta &lt;a&gt;.' },
        { q: '¿Qué etiqueta engloba todo el documento HTML?', o: ['&lt;main&gt;', '&lt;body&gt;', '&lt;html&gt;'], a: 2, exp: 'Todo documento HTML estructurado debe estar envuelto dentro de las etiquetas &lt;html&gt; y &lt;/html&gt;.' },
        { q: '¿Qué extensión tiene un archivo HTML?', o: ['.htm', '.html', 'Ambas'], a: 2, exp: 'Tanto .htm como .html son extensiones válidas de documentos HTML.' },
        { q: '¿Etiqueta para crear lista desordenada?', o: ['&lt;ul&gt;', '&lt;ol&gt;', '&lt;li&gt;'], a: 0, exp: '&lt;ul&gt; (Unordered List) se usa para listas con viñetas.' },
        { q: '¿Propósito de "alt" en etiqueta &lt;img&gt;?', o: ['Describir la imagen para accesibilidad', 'Definir el tamaño de la imagen', 'Enlazar a otra página'], a: 0, exp: 'El atributo alt provee un texto alternativo si la imagen no carga o para lectores de pantalla.' },
        { q: '¿Etiqueta HTML5 para contenido autónomo?', o: ['&lt;article&gt;', '&lt;section&gt;', '&lt;div&gt;'], a: 0, exp: 'La etiqueta &lt;article&gt; representa un bloque de contenido autónomo independiente.' },
        { q: '¿Cuál es un elemento en línea (inline)?', o: ['&lt;span&gt;', '&lt;div&gt;', '&lt;p&gt;'], a: 0, exp: '&lt;span&gt; es un elemento inline y no crea saltos de línea automáticos.' },
        { q: '¿Etiqueta para el título en la pestaña?', o: ['&lt;title&gt;', '&lt;header&gt;', '&lt;h1&gt;'], a: 0, exp: 'La etiqueta &lt;title&gt; especifica el título del documento visible en la pestaña del navegador.' },
        { q: '¿Etiqueta para insertar JavaScript?', o: ['&lt;javascript&gt;', '&lt;script&gt;', '&lt;code&gt;'], a: 1, exp: 'La etiqueta &lt;script&gt; se utiliza para incluir código JavaScript del lado del cliente.' },
        { q: '¿Valor por defecto de "target" en &lt;a&gt;?', o: ['_blank', '_self', '_parent'], a: 1, exp: 'Por defecto, target es _self, lo que abre el enlace en la misma pestaña.' },
        { q: '¿Etiqueta HTML5 para encabezados?', o: ['&lt;head&gt;', '&lt;header&gt;', '&lt;heading&gt;'], a: 1, exp: '&lt;header&gt; es el contenedor semántico para elementos introductorios.' },
        { q: '¿Atributo para campo obligatorio?', o: ['required', 'validate', 'mandatory'], a: 0, exp: 'El atributo required le indica al navegador que el campo debe completarse.' },
        { q: '¿Etiqueta para reproducir audio?', o: ['&lt;sound&gt;', '&lt;audio&gt;', '&lt;media&gt;'], a: 1, exp: 'La etiqueta &lt;audio&gt; permite integrar contenido de sonido en páginas web nativamente.' },
        { q: '¿Etiqueta HTML5 para barra lateral?', o: ['&lt;aside&gt;', '&lt;sidebar&gt;', '&lt;section&gt;'], a: 0, exp: 'La etiqueta &lt;aside&gt; define contenido secundario o barras laterales.' },
        { q: '¿Qué hace &lt;meta charset="UTF-8"&gt;?', o: ['Especificar el idioma de la página', 'Especificar la codificación de caracteres', 'Mejorar el posicionamiento SEO'], a: 1, exp: 'charset="UTF-8" le dice al navegador que use la codificación UTF-8 para caracteres especiales.' },
        { q: '¿Etiqueta HTML5 para agrupar imagen y pie?', o: ['&lt;figure&gt;', '&lt;image-group&gt;', '&lt;picture&gt;'], a: 0, exp: '&lt;figure&gt; se utiliza para agrupar imágenes y sus leyendas asociadas.' },
        { q: '¿Atributo para carga diferida (lazy)?', o: ['loading="lazy"', 'lazy="true"', 'defer="image"'], a: 0, exp: 'El atributo loading="lazy" retrasa la carga de la imagen hasta que esté cerca de la pantalla.' },
        { q: '¿Etiqueta para resaltar texto?', o: ['&lt;highlight&gt;', '&lt;mark&gt;', '&lt;strong&gt;'], a: 1, exp: 'La etiqueta &lt;mark&gt; representa texto marcado o resaltado.' }
    ],
    css: [
        { q: '¿Qué significa CSS?', o: ['Cascading Style Sheets', 'Creative Style System', 'Computer Style Syntax'], a: 0, exp: 'CSS significa Cascading Style Sheets (Hojas de Estilo en Cascada).' },
        { q: '¿Cómo se selecciona una clase?', o: ['#clase', '.clase', 'clase'], a: 1, exp: 'En CSS, las clases se seleccionan anteponiendo un punto (.) al nombre de la clase.' },
        { q: '¿Propiedad para color de fondo?', o: ['background-color', 'color', 'bgcolor'], a: 0, exp: 'La propiedad background-color establece el color de fondo de un elemento.' },
        { q: '¿Qué unidad es relativa a la fuente?', o: ['px', 'em', '%'], a: 1, exp: 'La unidad em es relativa al tamaño de fuente del elemento.' },
        { q: '¿Cómo se comenta en CSS?', o: ['/* comentario */', '// comentario', '&lt;!-- comentario --&gt;'], a: 0, exp: 'Los comentarios en CSS únicamente se escriben delimitados por /* y */.' },
        { q: '¿Propiedad para espaciado interno?', o: ['padding', 'margin', 'border-spacing'], a: 0, exp: 'padding define el espacio entre el contenido de un elemento y su borde.' },
        { q: '¿Selector para elemento con ID "header"?', o: ['#header', '.header', 'header'], a: 0, exp: 'Los selectores de ID se escriben anteponiendo un signo de (#) en CSS.' },
        { q: '¿Propiedad para cambiar tipografía?', o: ['font-family', 'font-style', 'font-type'], a: 0, exp: 'La propiedad font-family permite definir la tipografía para el elemento.' },
        { q: '¿Position para fijar a la ventana?', o: ['fixed', 'absolute', 'sticky'], a: 0, exp: 'position: fixed posiciona el elemento respecto a la ventana, manteniéndolo fijo al hacer scroll.' },
        { q: '¿Cómo quitar subrayado a enlaces?', o: ['text-decoration: none;', 'text-style: no-underline;', 'link-style: none;'], a: 0, exp: 'La propiedad text-decoration: none remueve el subrayado predeterminado.' },
        { q: '¿Propiedad para contenido desbordado?', o: ['overflow', 'clip', 'display'], a: 0, exp: 'La propiedad overflow controla qué sucede con el contenido que se desborda de su contenedor.' },
        { q: '¿Diferencia: display:none y visibility:hidden?', o: ['display: none elimina el espacio del elemento; visibility: hidden lo conserva', 'visibility: hidden elimina el espacio; display: none lo conserva', 'No hay diferencias'], a: 0, exp: 'display: none quita al elemento del layout, mientras que visibility: hidden solo lo hace invisible ocupando espacio.' },
        { q: '¿Selector para elementos hijos pares?', o: [':nth-child(even)', ':nth-child(odd)', ':nth-child(2)'], a: 0, exp: 'La pseudoclase :nth-child(even) selecciona los elementos pares en la estructura.' },
        { q: '¿Propiedad para orden tridimensional (eje Z)?', o: ['z-index', 'layer-index', '3d-position'], a: 0, exp: 'La propiedad z-index establece el apilamiento tridimensional de los elementos.' },
        { q: '¿Propiedad para sombras en contenedor?', o: ['text-shadow', 'box-shadow', 'shadow-color'], a: 1, exp: 'box-shadow se utiliza para aplicar sombras a los contenedores.' },
        { q: '¿Cómo se declara una variable CSS?', o: ['var-mi-variable: valor;', '--mi-variable: valor;', '$mi-variable: valor;'], a: 1, exp: 'Las variables personalizadas de CSS nativas se declaran anteponiendo un doble guion (--mi-variable).' },
        { q: '¿Flexbox: alinear en eje secundario?', o: ['justify-content', 'align-items', 'flex-direction'], a: 1, exp: 'align-items alinea elementos a lo largo del eje secundario de Flexbox.' },
        { q: '¿Propiedad para fondo fijo/móvil?', o: ['background-attachment', 'background-scroll', 'background-fixed'], a: 0, exp: 'background-attachment: fixed hace que la imagen de fondo permanezca fija al hacer scroll.' },
        { q: '¿Valor por defecto de "position"?', o: ['relative', 'static', 'absolute'], a: 1, exp: 'El valor por defecto es static, lo que sigue el flujo normal del documento.' },
        { q: '¿Cómo aplicar desenfoque (blur)?', o: ['filter: blur(5px);', 'backdrop-filter: blur(5px);', 'image-effect: blur(5px);'], a: 0, exp: 'La propiedad filter aplica efectos gráficos como desenfoque (blur) a un elemento.' }
    ],
    js: [
        { q: '¿Qué tipo de lenguaje es JavaScript?', o: ['Compilado', 'Interpretado', 'Ambos'], a: 1, exp: 'JavaScript es un lenguaje interpretado (compilado justo a tiempo por el navegador).' },
        { q: '¿Cómo declarar variable en JavaScript?', o: ['var x;', 'int x;', 'let x = 0;'], a: 0, exp: 'Tradicionalmente se declaraba con var, y modernamente con let o const.' },
        { q: '¿Método para mostrar alerta en pantalla?', o: ['alert()', 'print()', 'show()'], a: 0, exp: 'El método alert() abre una ventana de diálogo modal del navegador.' },
        { q: '¿Cuál NO es un tipo de dato en JS?', o: ['string', 'float', 'boolean'], a: 1, exp: 'En JS los decimales se representan dentro del tipo general "number".' },
        { q: '¿Comentario de una línea en JS?', o: ['// comentario', '/* comentario */', '&lt;!-- comentario --&gt;'], a: 0, exp: 'El doble guion diagonal (//) indica un comentario de una línea.' },
        { q: '¿Método para convertir texto a entero?', o: ['parseInt()', 'toString()', 'parseNumber()'], a: 0, exp: 'La función parseInt() parsea una cadena y devuelve un entero.' },
        { q: '¿Operador de igualdad estricta?', o: ['===', '==', '='], a: 0, exp: 'El operador === evalúa si el valor y el tipo de datos son idénticos.' },
        { q: '¿Cómo agregar elemento al final de array?', o: ['array.push()', 'array.pop()', 'array.add()'], a: 0, exp: 'El método push() añade elementos al final del array y devuelve la nueva longitud.' },
        { q: '¿Palabra clave para constantes?', o: ['const', 'let', 'var'], a: 0, exp: 'const declara una variable de bloque cuyo valor no puede ser reasignado.' },
        { q: '¿Evento disparado al hacer clic?', o: ['onclick', 'onhover', 'onsubmit'], a: 0, exp: 'El evento onclick detecta clics de puntero sobre un elemento.' },
        { q: '¿Diferencia entre == y ===?', o: ['== convierte tipos; === compara valor y tipo sin convertir', '== es asignación; === es comparación', 'No hay diferencias'], a: 0, exp: 'El operador == realiza coerción de tipos; === evalúa igualdad estricta.' },
        { q: '¿Qué es un "closure" en JS?', o: ['Función que recuerda variables de su ámbito externo', 'Función que se ejecuta de inmediato', 'Ámbito exclusivo global'], a: 0, exp: 'Un closure es una función que retiene el acceso al ámbito léxico en el que fue declarada.' },
        { q: '¿Resultado de typeof null?', o: ['"object"', '"null"', '"undefined"'], a: 0, exp: 'typeof null devuelve "object" debido a un error histórico de JS.' },
        { q: '¿Método para mapear y transformar array?', o: ['map()', 'forEach()', 'filter()'], a: 0, exp: 'El método map() crea un nuevo array aplicando una transformación a cada elemento.' },
        { q: '¿Qué significa que JS es monohilo?', o: ['Ejecuta una sola tarea a la vez en un solo hilo', 'Tiene múltiples hilos paralelos', 'Funciona en un solo procesador'], a: 0, exp: 'JavaScript ejecuta secuencialmente una sola tarea a la vez en el hilo principal.' },
        { q: '¿Capturar error asíncrono con try...catch?', o: ['Usar await y estar dentro del bloque try', 'Usando .then().catch()', 'Poner try en el callback'], a: 0, exp: 'Para capturar errores de promesas en try...catch, se debe anteponer la palabra clave await.' },
        { q: '¿Qué hace el método reduce?', o: ['Aplica una función acumuladora para obtener un único valor', 'Elimina elementos duplicados', 'Reduce el tamaño del array'], a: 0, exp: 'reduce() acumula el contenido de un array en un único valor de retorno.' },
        { q: '¿Qué es una Promesa "pending"?', o: ['Operación asíncrona no completada ni rechazada aún', 'Promesa resuelta con éxito', 'Promesa con error de red'], a: 0, exp: 'El estado "pending" indica que el proceso asíncrono no ha finalizado.' },
        { q: '¿Método para unir arrays?', o: ['concat()', 'join()', 'merge()'], a: 0, exp: 'El método concat() une dos o más arrays devolviendo uno nuevo.' },
        { q: '¿Clases: palabra para heredar de otra?', o: ['extends', 'inherits', 'implements'], a: 0, exp: 'La palabra clave extends se usa en declaraciones de clase para definir la herencia.' }
    ],
    redes: [
        { q: '¿Qué es una dirección IP?', o: ['Identificador lógico de red', 'Protocolo de enrutamiento', 'Hardware de conexión'], a: 0, exp: 'Una dirección IP identifica lógicamente y de forma única a una interfaz de red.' },
        { q: '¿Qué puerto por defecto usa HTTP?', o: ['21', '80', '443'], a: 1, exp: 'HTTP utiliza el puerto 80 por defecto para tráfico no cifrado.' },
        { q: '¿Qué significa LAN?', o: ['Large Area Network', 'Local Area Network', 'Light Area Network'], a: 1, exp: 'LAN significa Local Area Network (Red de Área Local).' },
        { q: '¿Qué dispositivo conecta redes distintas?', o: ['Switch', 'Router', 'Hub'], a: 1, exp: 'El Router conecta redes distintas y enruta paquetes de datos.' },
        { q: '¿Qué protocolo asigna IPs automáticamente?', o: ['DNS', 'DHCP', 'FTP'], a: 1, exp: 'DHCP asigna automáticamente direcciones IP y configuración de red.' },
        { q: '¿Protocolo seguro para páginas web?', o: ['HTTPS', 'HTTP', 'FTP'], a: 0, exp: 'HTTPS cifra la conexión web utilizando SSL/TLS.' },
        { q: '¿Qué significa DNS?', o: ['Domain Name System', 'Digital Network Service', 'Dynamic Name Server'], a: 0, exp: 'DNS traduce nombres de dominio legibles en direcciones IP numéricas.' },
        { q: '¿Máscara por defecto de Clase C?', o: ['255.255.255.0', '255.255.0.0', '255.0.0.0'], a: 0, exp: 'La máscara por defecto de una red de Clase C es 255.255.255.0.' },
        { q: '¿Qué capa OSI enruta paquetes?', o: ['Capa de Red', 'Capa Física', 'Capa de Transporte'], a: 0, exp: 'La capa de Red (Capa 3) del modelo OSI enruta y direcciona los datos.' },
        { q: '¿Puerto estándar de SMTP seguro?', o: ['465', '80', '22'], a: 0, exp: 'El puerto 465 se reserva comúnmente para envío SMTP seguro bajo SSL/TLS.' },
        { q: '¿Propósito del protocolo ARP?', o: ['Traducir direcciones IP a direcciones físicas MAC', 'Asignar IPs fijas', 'Garantizar envío fiable'], a: 0, exp: 'ARP asocia una dirección IP a la dirección física MAC del hardware local.' },
        { q: '¿Capa TCP/IP donde opera HTTP?', o: ['Capa de Aplicación', 'Capa de Internet', 'Capa de Acceso a Red'], a: 0, exp: 'HTTP opera en la capa de Aplicación de la pila de protocolos TCP/IP.' },
        { q: '¿Rango IP privado de Clase C?', o: ['192.168.0.0 a 192.168.255.255', '10.0.0.0 a 10.255.255.255', '172.16.0.0 a 172.31.255.255'], a: 0, exp: 'El rango privado de Clase C estándar es 192.168.0.0 a 192.168.255.255.' },
        { q: '¿Protocolo de transporte con conexión?', o: ['UDP', 'TCP', 'IP'], a: 1, exp: 'TCP es un protocolo orientado a conexión y de entrega de datos fiable.' },
        { q: '¿Qué hace NAT en un router?', o: ['Traduce direcciones IP privadas a una pública para compartir internet', 'Controla flujo de paquetes', 'Cifra datos en tránsito'], a: 0, exp: 'NAT traduce IPs privadas locales a una pública para salir a internet.' },
        { q: '¿Puerto por defecto de SSH/SFTP?', o: ['22', '21', '80'], a: 0, exp: 'SSH y SFTP usan de forma estándar el puerto TCP 22.' },
        { q: '¿Función principal de un Proxy?', o: ['Actuar como intermediario entre un cliente y el servidor', 'Asignar IPs en una red', 'Acelerar la CPU de los routers'], a: 0, exp: 'Un servidor proxy es un intermediario para control, caché o anonimato.' },
        { q: '¿Qué representa la dirección ::1?', o: ['La dirección de loopback local en IPv6', 'Dirección IP pública reservada', 'Equivalente a 255.255.255.255'], a: 0, exp: 'La dirección ::1 representa la dirección local (loopback) en IPv6.' },
        { q: '¿Protocolo para evitar bucles en switches?', o: ['STP (Spanning Tree Protocol)', 'RIP (Routing Information Protocol)', 'OSPF'], a: 0, exp: 'STP evita bucles en topologías de switches desactivando puertos redundantes.' },
        { q: '¿Propósito principal del protocolo ICMP?', o: ['Enviar mensajes de control y reporte de errores (como ping)', 'Transferir archivos', 'Configurar switches'], a: 0, exp: 'ICMP se utiliza para reportar errores de enrutamiento y diagnóstico de red.' }
    ],
    so: [
        { q: '¿Qué es un sistema operativo?', o: ['Programa de aplicación', 'Software que administra hardware y recursos', 'Hardware del procesador'], a: 1, exp: 'El SO administra recursos de hardware y sirve de plataforma para aplicaciones.' },
        { q: '¿Cuál NO es un sistema operativo?', o: ['Linux', 'Windows', 'HTML'], a: 2, exp: 'HTML es un lenguaje de marcado hipertexto para la web.' },
        { q: '¿Comando Linux para listar archivos?', o: ['ls', 'cd', 'pwd'], a: 0, exp: 'El comando ls (list) muestra los archivos del directorio de trabajo actual.' },
        { q: '¿Qué es un proceso en el SO?', o: ['Un programa en estado de ejecución activa', 'Un archivo estático en disco', 'Usuario de red'], a: 0, exp: 'Un proceso es la abstracción activa de un programa en ejecución.' },
        { q: '¿SO de código abierto?', o: ['Windows', 'Linux', 'macOS'], a: 1, exp: 'El kernel de Linux se distribuye bajo licencias de código abierto.' },
        { q: '¿Comando Linux para cambiar permisos?', o: ['chmod', 'chown', 'chperm'], a: 0, exp: 'chmod (change mode) altera los permisos de acceso de un archivo en Linux.' },
        { q: '¿Sistema de archivos estándar Windows?', o: ['NTFS', 'ext4', 'FAT32'], a: 0, exp: 'NTFS es el sistema de archivos predeterminado para Windows moderno.' },
        { q: '¿Qué es la memoria virtual (swap)?', o: ['Espacio en disco utilizado para extender la memoria RAM', 'Chip de memoria ultra rápida', 'Memoria volátil en la nube'], a: 0, exp: 'La swap usa disco duro para simular memoria RAM adicional.' },
        { q: '¿Comando Linux para ruta actual?', o: ['pwd', 'cd', 'whereami'], a: 0, exp: 'El comando pwd (print working directory) imprime la ruta del directorio activo.' },
        { q: '¿Estructura para cola de procesos?', o: ['Cola de procesos', 'Pila de llamadas', 'Árbol de directorios'], a: 0, exp: 'La cola de procesos gestiona secuencialmente a los procesos listos para ejecutarse.' },
        { q: '¿Qué es un Deadlock (interbloqueo)?', o: ['Procesos bloqueados esperando recursos mutuamente de forma indefinida', 'Fallo del disco duro principal', 'Virus de memoria RAM'], a: 0, exp: 'El interbloqueo ocurre cuando dos procesos están bloqueados esperando recursos del otro.' },
        { q: '¿Comando Linux para buscar texto?', o: ['grep', 'find', 'search'], a: 0, exp: 'El comando grep busca patrones de texto que coincidan con un criterio en archivos.' },
        { q: '¿Qué hace la tabla de páginas?', o: ['Mapear direcciones virtuales de procesos a direcciones físicas RAM', 'Hacer un índice de archivos', 'Listar usuarios autorizados'], a: 0, exp: 'La tabla de páginas traduce direcciones de memoria lógicas a direcciones de RAM física.' },
        { q: '¿Comando Linux para ver procesos en vivo?', o: ['top', 'ps', 'process-list'], a: 0, exp: 'El comando top proporciona una vista dinámica y en vivo de los procesos activos.' },
        { q: '¿Qué componente planifica la CPU?', o: ['Planificador o Scheduler', 'Gestor de memoria', 'BIOS'], a: 0, exp: 'El Scheduler asigna el tiempo de uso de la CPU a los procesos listos.' },
        { q: '¿Qué es una llamada al sistema (syscall)?', o: ['Interfaz para solicitar servicios del núcleo del SO', 'Alerta telefónica de error', 'Interrupción externa de teclado'], a: 0, exp: 'Las syscalls permiten que las aplicaciones soliciten servicios al núcleo del SO.' },
        { q: '¿Sistema de archivos nativo de Linux?', o: ['ext4', 'NTFS', 'APFS'], a: 0, exp: 'ext4 es el sistema de archivos por defecto para la mayoría de distros Linux.' },
        { q: '¿PowerShell: listar servicios?', o: ['Get-Service', 'services.msc', 'list-services'], a: 0, exp: 'Get-Service de PowerShell recupera el estado de los servicios instalados.' },
        { q: '¿Comando Linux para cambiar dueño?', o: ['chown', 'chmod', 'owner'], a: 0, exp: 'El comando chown (change owner) modifica el propietario de un archivo.' },
        { q: '¿Qué es la fragmentación externa?', o: ['Memoria total libre suficiente pero no contigua para usarse', 'Desgaste del hardware de la RAM', 'Datos corruptos por fallos de luz'], a: 0, exp: 'Ocurre cuando la memoria libre se divide en pequeños bloques no contiguos.' }
    ]
};

// Configuración de la API
const API_URL = window.location.origin + '/api';

// Utilidades
const utils = {
    async fetchAPI(endpoint, options = {}) {
        const token = sessionStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        try {
            const response = await fetch(`${API_URL}/${endpoint}`, {
                ...options,
                headers
            });
            const data = await response.json();
            if (!response.ok) {
                if (response.status === 401) {
                    utils.cerrarSesion();
                    throw new Error('Sesión expirada o token inválido. Por favor inicia sesión nuevamente.');
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
        sessionStorage.removeItem('rol');
        sessionStorage.removeItem('email');
        window.location.href = 'index.html';
    },

    mostrarMensaje(elemento, mensaje, tipo = 'error') {
        if (elemento) {
            elemento.textContent = mensaje;
            elemento.className = `mensaje-${tipo}`;
        } else {
            console.error('Elemento no encontrado para mostrar mensaje:', mensaje);
        }
    },

    parseSQLiteDate(sqliteDateString) {
        if (!sqliteDateString) return new Date();
        if (sqliteDateString.includes('Z') || sqliteDateString.includes('+')) {
            return new Date(sqliteDateString);
        }
        const utcString = sqliteDateString.replace(' ', 'T') + 'Z';
        return new Date(utcString);
    }
};

function runOnDOMReady(fn) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fn);
    } else {
        fn();
    }
}

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
                usuario_id: parseInt(usuarioId, 10),
                examen_id: examenId
            })
        });
    },

    async obtenerHistorial() {
        const usuario = utils.getUsuarioActual();
        return utils.fetchAPI(`examenes/${usuario.id}`);
    }
};

window.generarCertificadoPDF = async function (username, examId, score, codigoVerificacion, fechaEmision) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
    });

    // Helper para cálculo matemático de curvas Bézier cuadráticas para ondas
    const getQuadraticBezierPoints = (x0, y0, x1, y1, x2, y2, steps = 30) => {
        const points = [];
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const mt = 1 - t;
            const x = mt * mt * x0 + 2 * mt * t * x1 + t * t * x2;
            const y = mt * mt * y0 + 2 * mt * t * y1 + t * t * y2;
            points.push({ x, y });
        }
        return points;
    };

    // Helper para dibujar polígonos usando la API lines nativa de jsPDF
    const drawLinesPolygon = (points, r, g, b) => {
        if (points.length === 0) return;
        const startX = points[0].x;
        const startY = points[0].y;
        const acc = [];
        for (let i = 1; i < points.length; i++) {
            acc.push([points[i].x - points[i - 1].x, points[i].y - points[i - 1].y]);
        }
        const last = points[points.length - 1];
        if (Math.abs(last.x - startX) > 0.001 || Math.abs(last.y - startY) > 0.001) {
            acc.push([startX - last.x, startY - last.y]);
        }
        doc.setFillColor(r, g, b);
        doc.lines(acc, startX, startY, [1, 1], 'F');
    };

    // Helper para ondas delgadas
    const drawCurveRibbon = (x0_1, y0_1, x1_1, y1_1, x2_1, y2_1, x0_2, y0_2, x1_2, y1_2, x2_2, y2_2, r, g, b) => {
        const pts1 = getQuadraticBezierPoints(x0_1, y0_1, x1_1, y1_1, x2_1, y2_1);
        const pts2 = getQuadraticBezierPoints(x2_2, y2_2, x1_2, y1_2, x0_2, y0_2);
        const points = pts1.concat(pts2);
        drawLinesPolygon(points, r, g, b);
    };

    // Helper para ondas gruesas
    const drawThickWave = (x0, y0, x1, y1, x2, y2, closeX1, closeY1, closeX2, closeY2, r, g, b) => {
        const pts = getQuadraticBezierPoints(x0, y0, x1, y1, x2, y2);
        pts.push({ x: closeX1, y: closeY1 });
        pts.push({ x: closeX2, y: closeY2 });
        drawLinesPolygon(pts, r, g, b);
    };

    // Helper para estrella vectorial
    const drawStar = (cx, cy, spikes, outerRadius, innerRadius, r, g, b) => {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;
        const points = [];
        for (let i = 0; i < spikes * 2; i++) {
            x = cx + Math.cos(rot) * (i % 2 === 0 ? outerRadius : innerRadius);
            y = cy + Math.sin(rot) * (i % 2 === 0 ? outerRadius : innerRadius);
            points.push({ x, y });
            rot += step;
        }
        drawLinesPolygon(points, r, g, b);
    };

    // Esquinas ornamentales vectoriales de seguridad en Oro
    const drawCornerOrnament = (x, y, scaleX = 1, scaleY = 1) => {
        doc.setDrawColor(212, 175, 55); // Oro Metálico
        doc.setLineWidth(0.6);
        // Esquina L exterior
        doc.line(x, y, x + 12 * scaleX, y);
        doc.line(x, y, x, y + 12 * scaleY);
        // Esquina L interior
        doc.setLineWidth(0.3);
        doc.line(x + 2 * scaleX, y + 2 * scaleY, x + 9 * scaleX, y + 2 * scaleY);
        doc.line(x + 2 * scaleX, y + 2 * scaleY, x + 2 * scaleX, y + 9 * scaleY);
        // Punto de seguridad
        doc.setFillColor(244, 215, 94);
        doc.circle(x + 4 * scaleX, y + 4 * scaleY, 0.6, 'F');
    };

    // Paleta de Colores Institucionales y de Neón
    const brandColors = {
        bgDark: [15, 23, 42],        // Slate 900
        bgCard: [30, 41, 59],        // Slate 800
        textWhite: [255, 255, 255],  // Blanco Puro
        textSlate: [203, 213, 225],  // Slate 300
        textMuted: [148, 163, 184],  // Slate 400
        neonCyan: [30, 144, 255],    // Azul Dodger
        neonOrange: [255, 107, 53],  // Naranja Neón
        neonGreen: [0, 255, 136],    // Verde Esmeralda
        gold: [244, 215, 94],        // Oro Brillante
        goldDark: [180, 140, 40],    // Oro Cobre
        borderDarkBlue: [16, 28, 52], // Azul Marino Oscuro
        borderDarkOrange: [160, 60, 20]
    };

    const verificationUrl = `${window.location.origin}/verificar.html?code=${codigoVerificacion}`;

    // Cargar Medalla Oficial y Firmas Reales
    let medalLoaded = false;
    const medalImg = new Image();
    medalImg.crossOrigin = 'anonymous';

    let signatureLoaded = false;
    const signatureImg = new Image();
    signatureImg.crossOrigin = 'anonymous';

    let signature2Loaded = false;
    const signature2Img = new Image();
    signature2Img.crossOrigin = 'anonymous';

    await Promise.all([
        new Promise((resolve) => {
            medalImg.onload = () => { medalLoaded = true; resolve(); };
            medalImg.onerror = () => resolve();
            setTimeout(resolve, 2000);
            medalImg.src = '/images/medal_valida.png';
        }),
        new Promise((resolve) => {
            signatureImg.onload = () => { signatureLoaded = true; resolve(); };
            signatureImg.onerror = () => resolve();
            setTimeout(resolve, 2000);
            signatureImg.src = '/images/firma_octavio.png';
        }),
        new Promise((resolve) => {
            signature2Img.onload = () => { signature2Loaded = true; resolve(); };
            signature2Img.onerror = () => resolve();
            setTimeout(resolve, 2000);
            signature2Img.src = '/images/firma_evaluador.png';
        })
    ]);

    // Helper para procesar la imagen de firma: hacer transparente el fondo blanco y pintar el trazo del color deseado
    const procesarFirma = (img, colorRGB) => {
        try {
            const canvasProcess = document.createElement('canvas');
            canvasProcess.width = img.naturalWidth;
            canvasProcess.height = img.naturalHeight;
            const ctxProcess = canvasProcess.getContext('2d');
            ctxProcess.drawImage(img, 0, 0);
            const imgData = ctxProcess.getImageData(0, 0, canvasProcess.width, canvasProcess.height);
            const data = imgData.data;
            
            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i+1];
                const b = data[i+2];
                
                // Brillo/Luminancia
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                
                if (luminance > 220) {
                    data[i+3] = 0; // Transparente
                } else {
                    // Colorear con el tono del certificado
                    data[i] = colorRGB[0];
                    data[i+1] = colorRGB[1];
                    data[i+2] = colorRGB[2];
                    
                    // Suavizado anti-alias basado en la oscuridad del píxel original
                    const alpha = (255 - luminance) / 255;
                    data[i+3] = Math.round(alpha * 255);
                }
            }
            ctxProcess.putImageData(imgData, 0, 0);
            return canvasProcess.toDataURL('image/png');
        } catch (error) {
            console.error('Error al procesar firma:', error);
            return null;
        }
    };

    // Renderizar Fondo Degradado Radial y Marca de Agua en Canvas Offscreen
    const canvas = document.createElement('canvas');
    canvas.width = 2000;
    canvas.height = 1414;
    const ctx = canvas.getContext('2d');

    // 1. Degradado Radial Azul Noche / Slate Profundo
    const grad = ctx.createRadialGradient(1000, 707, 100, 1000, 707, 1300);
    grad.addColorStop(0, '#0e2645');   // Azul Centro Iluminado
    grad.addColorStop(0.5, '#07101d'); // Slate Medianoche
    grad.addColorStop(1, '#03050a');   // Fondo Borde Oscuro
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 2000, 1414);

    // 2. Anillos Concéntricos y Marca de Agua Académica
    ctx.strokeStyle = 'rgba(244, 215, 94, 0.025)';
    ctx.lineWidth = 2;
    for (let r = 80; r < 1400; r += 40) {
        ctx.beginPath();
        ctx.arc(1000, 707, r, 0, Math.PI * 2);
        ctx.stroke();
    }

    // Trama Radial de Red Tecnológica
    ctx.strokeStyle = 'rgba(30, 144, 255, 0.018)';
    ctx.lineWidth = 1;
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 24) {
        ctx.beginPath();
        ctx.moveTo(1000, 707);
        ctx.lineTo(1000 + Math.cos(angle) * 1400, 707 + Math.sin(angle) * 1400);
        ctx.stroke();
    }

    const bgDataUrl = canvas.toDataURL('image/jpeg', 0.95);
    doc.addImage(bgDataUrl, 'JPEG', 0, 0, 297, 210);

    // Marcos de Seguridad Múltiples (Oro + Azul Neón)
    doc.setDrawColor(212, 175, 55, 0.8); // Borde exterior Oro
    doc.setLineWidth(0.6);
    doc.rect(6, 6, 285, 198, 'D');

    doc.setDrawColor(30, 144, 255, 0.4); // Borde interior Azul
    doc.setLineWidth(0.3);
    doc.rect(9, 9, 279, 192, 'D');

    // 4 Esquinas Ornamentales de Seguridad
    drawCornerOrnament(11, 11, 1, 1);
    drawCornerOrnament(286, 11, -1, 1);
    drawCornerOrnament(11, 199, 1, -1);
    drawCornerOrnament(286, 199, -1, -1);

    // Ondas decorativas superiores e inferiores
    drawThickWave(0, 16, 148.5, 0, 297, 16, 297, 0, 0, 0, brandColors.borderDarkBlue[0], brandColors.borderDarkBlue[1], brandColors.borderDarkBlue[2]);
    drawCurveRibbon(0, 22, 148.5, 5, 297, 22, 0, 20, 148.5, 3, 297, 20, brandColors.borderDarkOrange[0], brandColors.borderDarkOrange[1], brandColors.borderDarkOrange[2]);

    drawThickWave(0, 194, 148.5, 210, 297, 194, 297, 210, 0, 210, brandColors.borderDarkBlue[0], brandColors.borderDarkBlue[1], brandColors.borderDarkBlue[2]);
    drawCurveRibbon(0, 188, 148.5, 205, 297, 188, 0, 190, 148.5, 207, 297, 190, brandColors.borderDarkOrange[0], brandColors.borderDarkOrange[1], brandColors.borderDarkOrange[2]);

    // Insignia Institucional de la Universidad
    doc.setFillColor(brandColors.bgCard[0], brandColors.bgCard[1], brandColors.bgCard[2]);
    doc.roundedRect(68, 16, 161, 7, 1.5, 1.5, 'F');
    doc.setDrawColor(brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(68, 16, 161, 7, 1.5, 1.5, 'D');

    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    doc.text('UNIVERSIDAD NACIONAL DEL LITORAL  •  FACULTAD DE INGENIERÍA Y CIENCIAS HÍDRICAS', 148.5, 20.8, { align: 'center' });

    // Logo CertiWebs
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    const logoT1 = 'Certi'; const logoT2 = 'Webs';
    const logoW = doc.getTextWidth(logoT1 + logoT2);
    const startLogoX = 148.5 - (logoW / 2);
    doc.setTextColor(brandColors.textWhite[0], brandColors.textWhite[1], brandColors.textWhite[2]);
    doc.text(logoT1, startLogoX, 31);
    doc.setTextColor(brandColors.neonCyan[0], brandColors.neonCyan[1], brandColors.neonCyan[2]);
    doc.text(logoT2, startLogoX + doc.getTextWidth(logoT1), 31);

    // 5 Estrellas Doradas Vectoriales
    const starY = 37;
    const starR = 2.2;
    const starInner = 0.9;
    drawStar(148.5 - 16, starY, 5, starR, starInner, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    drawStar(148.5 - 8, starY, 5, starR, starInner, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    drawStar(148.5, starY, 5, starR, starInner, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    drawStar(148.5 + 8, starY, 5, starR, starInner, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    drawStar(148.5 + 16, starY, 5, starR, starInner, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);

    // Título del Certificado (CERTIFICADO DE ACREDITACIÓN TÉCNICA)
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    // Sombra
    doc.setTextColor(5, 8, 16);
    doc.text("CERTIFICADO DE ACREDITACIÓN TÉCNICA", 148.5 + 0.4, 49 + 0.4, { align: 'center' });
    // Texto principal
    doc.setTextColor(brandColors.textWhite[0], brandColors.textWhite[1], brandColors.textWhite[2]);
    doc.text("CERTIFICADO DE ACREDITACIÓN TÉCNICA", 148.5, 49, { align: 'center' });

    // Preamble de Otorgamiento
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10.5);
    doc.setTextColor(brandColors.textSlate[0], brandColors.textSlate[1], brandColors.textSlate[2]);
    doc.text('El Consejo Académico y el Comité Evaluador de CertiWebs otorga la presente certificación a:', 148.5, 62, { align: 'center' });

    // Nombre del Estudiante (Grande en Oro Brillante)
    doc.setFont("times", "bolditalic");
    doc.setFontSize(27);
    // Sombra
    doc.setTextColor(5, 8, 16);
    doc.text(username.toUpperCase(), 148.5 + 0.4, 76 + 0.4, { align: 'center' });
    // Texto Oro
    doc.setTextColor(brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    doc.text(username.toUpperCase(), 148.5, 76, { align: 'center' });

    // Línea de Adorno Doble bajo Nombre
    doc.setDrawColor(brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
    doc.setLineWidth(0.5);
    doc.line(65, 81, 140, 81);
    doc.line(157, 81, 232, 81);
    drawStar(148.5, 81, 5, 2.2, 0.9, brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);

    // Texto de Acreditación de Competencias
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(brandColors.textSlate[0], brandColors.textSlate[1], brandColors.textSlate[2]);
    doc.text('Por haber aprobado satisfactoriamente la evaluación teórica-práctica y demostrado idoneidad profesional en el área de:', 148.5, 90, { align: 'center' });

    // Mapeo detallado de materias y subtítulos
    let examLabel = 'DESARROLLO WEB & TECNOLOGÍA';
    let examSub = 'Acreditación en Competencias Informáticas';

    if (examId === 'html') {
        examLabel = 'DESARROLLO WEB FRONTEND CON HTML5';
        examSub = 'Estándares W3C, Semántica Web, Estructura HTML5 & Accesibilidad';
    } else if (examId === 'css') {
        examLabel = 'DISEÑO WEB RESPONSIVE CON CSS3';
        examSub = 'Flexbox, CSS Grid, Estilos Modernos, Animaciones & Layouts';
    } else if (examId === 'js') {
        examLabel = 'PROGRAMACIÓN EN JAVASCRIPT (ES6+)';
        examSub = 'Lógica de Programación, Manipulación del DOM, Funciones & Asincronía';
    } else if (examId === 'redes') {
        examLabel = 'REDES DE COMPUTADORAS & PROTOCOLOS';
        examSub = 'Modelo OSI, Arquitectura TCP/IP, Enrutamiento & Seguridad de Redes';
    } else if (examId === 'so') {
        examLabel = 'SISTEMAS OPERATIVOS & ARQUITECTURA';
        examSub = 'Gestión de Procesos, Memoria Virtual, Kernel & Sistemas de Archivos';
    }

    // Título de la Materia en Azul Dodger Neón
    doc.setFont("helvetica", "bold");
    doc.setFontSize(19);
    // Sombra
    doc.setTextColor(5, 8, 16);
    doc.text(examLabel, 148.5 + 0.4, 102 + 0.4, { align: 'center' });
    // Texto Azul
    doc.setTextColor(brandColors.neonCyan[0], brandColors.neonCyan[1], brandColors.neonCyan[2]);
    doc.text(examLabel, 148.5, 102, { align: 'center' });

    // Subtítulo técnico específico
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8.5);
    doc.setTextColor(brandColors.textMuted[0], brandColors.textMuted[1], brandColors.textMuted[2]);
    doc.text(`[ ${examSub} ]`, 148.5, 107.5, { align: 'center' });

    // Nivel de Distinción según el Puntaje (Sin caracteres emoji no compatibles con jsPDF)
    let distinctionLabel = `APROBADO CON SOLVENCIA  •  CALIFICACIÓN: ${score}%`;
    let colorDistinction = brandColors.neonGreen;

    if (score >= 90) {
        distinctionLabel = `MÉRITO SOBRESALIENTE Y EXCELENCIA ACADÉMICA  •  CALIFICACIÓN: ${score}%`;
        colorDistinction = brandColors.gold;
    } else if (score >= 80) {
        distinctionLabel = `DISTINCIÓN ACADÉMICA DESTACADA  •  CALIFICACIÓN: ${score}%`;
        colorDistinction = brandColors.neonCyan;
    } else {
        distinctionLabel = `REGISTRO DE COMPETENCIAS APROBADO  •  CALIFICACIÓN: ${score}%`;
        colorDistinction = brandColors.neonGreen;
    }

    // Insignia / Badge de Calificación y Mérito con estrella vectorial
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    const textW = doc.getTextWidth(distinctionLabel);
    const badgeW = textW + 16;
    const badgeH = 7.5;
    const badgeX = 148.5 - badgeW / 2;
    const badgeY = 113;

    doc.setFillColor(brandColors.bgCard[0], brandColors.bgCard[1], brandColors.bgCard[2]);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'F');
    doc.setDrawColor(colorDistinction[0], colorDistinction[1], colorDistinction[2]);
    doc.setLineWidth(0.4);
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1.5, 1.5, 'D');

    // Dibujar estrella vectorial decorativa dentro del badge
    drawStar(badgeX + 4.5, badgeY + 3.75, 5, 1.6, 0.7, colorDistinction[0], colorDistinction[1], colorDistinction[2]);
    drawStar(badgeX + badgeW - 4.5, badgeY + 3.75, 5, 1.6, 0.7, colorDistinction[0], colorDistinction[1], colorDistinction[2]);

    doc.setTextColor(colorDistinction[0], colorDistinction[1], colorDistinction[2]);
    doc.text(distinctionLabel, 148.5, badgeY + 5.2, { align: 'center' });

    // Fecha de Emisión Robusta (Formateo explícito para garantizar año completo "2026")
    let fechaFormatted = '';
    try {
        let dateObj;
        if (fechaEmision instanceof Date) {
            dateObj = fechaEmision;
        } else if (typeof fechaEmision === 'string' && fechaEmision.trim()) {
            if (fechaEmision.includes('Z') || fechaEmision.includes('+')) {
                dateObj = new Date(fechaEmision);
            } else {
                // Si viene de la base de datos sin indicador de zona horaria (UTC implícito),
                // le añadimos 'Z' para evitar que se reste la diferencia horaria al parsear localmente.
                const utcString = fechaEmision.replace(' ', 'T') + 'Z';
                dateObj = new Date(utcString);
            }
        } else {
            dateObj = new Date();
        }
        if (isNaN(dateObj.getTime())) dateObj = new Date();

        const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
        const dia = dateObj.getDate();
        const mes = meses[dateObj.getMonth()];
        const anio = dateObj.getFullYear();
        fechaFormatted = `${dia} de ${mes} de ${anio}`;
    } catch (e) {
        fechaFormatted = `${new Date().getDate()} de julio de 2026`;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(brandColors.textMuted[0], brandColors.textMuted[1], brandColors.textMuted[2]);
    doc.text(`Documento emitido y registrado digitalmente en el sistema el ${fechaFormatted}`, 148.5, 127.5, { align: 'center' });

    // Firmas Institucionales (Subidas a posición Y=162 para evitar interferencias)
    const yLine = 162;

    const drawSig = (pts) => {
        for (let i = 1; i < pts.length; i++) {
            doc.line(pts[i - 1].x, pts[i - 1].y, pts[i].x, pts[i].y);
        }
    };

    const drawVectorCheck = (x, y) => {
        doc.setDrawColor(brandColors.neonGreen[0], brandColors.neonGreen[1], brandColors.neonGreen[2]);
        doc.setLineWidth(0.45);
        doc.line(x, y + 1.2, x + 0.8, y + 2.0);
        doc.line(x + 0.8, y + 2.0, x + 2.4, y + 0.4);
    };

    // Firma 1: Octavio Ramírez (Coordinador General) - Usando la firma real procesada
    let firmaRealProcesada = null;
    if (signatureLoaded) {
        // Usamos azul neón para simular la tinta azul real
        firmaRealProcesada = procesarFirma(signatureImg, brandColors.neonCyan);
    }

    if (firmaRealProcesada) {
        // Dibujar la firma real en el centro de su área (X=109)
        doc.addImage(firmaRealProcesada, 'PNG', 99, yLine - 19, 20, 20);
    } else {
        // Fallback vectorial si la imagen no está cargada o hay un error
        doc.setDrawColor(brandColors.neonCyan[0], brandColors.neonCyan[1], brandColors.neonCyan[2], 0.7);
        doc.setLineWidth(0.45);
        drawSig([
            { x: 92, y: yLine - 5 },
            { x: 94, y: yLine - 11 },
            { x: 97, y: yLine - 4 },
            { x: 100, y: yLine - 9 },
            { x: 103, y: yLine - 5 },
            { x: 106, y: yLine - 8 },
            { x: 109, y: yLine - 6 },
            { x: 117, y: yLine - 5 }
        ]);
    }

    doc.setDrawColor(brandColors.bgCard[0], brandColors.bgCard[1], brandColors.bgCard[2], 0.6);
    doc.setLineWidth(0.35);
    doc.line(84, yLine, 134, yLine);

    doc.setTextColor(brandColors.textWhite[0], brandColors.textWhite[1], brandColors.textWhite[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text('Octavio Ramírez', 109, yLine + 4.5, { align: 'center' });
    doc.setTextColor(brandColors.textMuted[0], brandColors.textMuted[1], brandColors.textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text('Coordinador General CertiWebs', 109, yLine + 8, { align: 'center' });
    drawVectorCheck(92, yLine + 11);
    doc.setTextColor(brandColors.neonGreen[0], brandColors.neonGreen[1], brandColors.neonGreen[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text('FIRMA ELECTRÓNICA VÁLIDA', 96, yLine + 12.5);

    // Firma 2: Prof. Dr. Informática (Evaluador Académico) - Usando firma real procesada
    let firmaEvaluadorProcesada = null;
    if (signature2Loaded) {
        firmaEvaluadorProcesada = procesarFirma(signature2Img, brandColors.neonOrange);
    }

    if (firmaEvaluadorProcesada) {
        // Dibujar la firma real en el centro de su área (X=184)
        doc.addImage(firmaEvaluadorProcesada, 'PNG', 174, yLine - 19, 20, 20);
    } else {
        // Fallback vectorial si la imagen no está cargada o hay un error
        doc.setDrawColor(brandColors.neonOrange[0], brandColors.neonOrange[1], brandColors.neonOrange[2], 0.7);
        doc.setLineWidth(0.45);
        drawSig([
            { x: 167, y: yLine - 4 },
            { x: 171, y: yLine - 12 },
            { x: 174, y: yLine - 3 },
            { x: 177, y: yLine - 10 },
            { x: 180, y: yLine - 6 },
            { x: 184, y: yLine - 8 },
            { x: 188, y: yLine - 5 },
            { x: 195, y: yLine - 6 }
        ]);
    }

    doc.setDrawColor(brandColors.bgCard[0], brandColors.bgCard[1], brandColors.bgCard[2], 0.6);
    doc.line(159, yLine, 209, yLine);

    doc.setTextColor(brandColors.textWhite[0], brandColors.textWhite[1], brandColors.textWhite[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text('Prof. Dr. Informática', 184, yLine + 4.5, { align: 'center' });
    doc.setTextColor(brandColors.textMuted[0], brandColors.textMuted[1], brandColors.textMuted[2]);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7);
    doc.text('Evaluador Académico UNL', 184, yLine + 8, { align: 'center' });
    drawVectorCheck(167, yLine + 11);
    doc.setTextColor(brandColors.neonGreen[0], brandColors.neonGreen[1], brandColors.neonGreen[2]);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(5.5);
    doc.text('REGISTRO DOCENTE VERIFICADO', 171, yLine + 12.5);

    // Medalla Oficial de Certificación (Esquina Inferior Derecha)
    if (medalLoaded) {
        const medalWidth = 44;
        const medalHeight = 44;
        const medalX = 234;
        const medalY = 135;
        doc.addImage(medalImg, 'PNG', medalX, medalY, medalWidth, medalHeight);
    }



    // Pie de Validación Central (ID de Registro e Hipervínculo Clicable sin caracteres corruptos)
    const validationY = 182;
    if (codigoVerificacion) {
        doc.setTextColor(brandColors.gold[0], brandColors.gold[1], brandColors.gold[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text(`CÓDIGO DE VALIDACIÓN: ${codigoVerificacion}`, 148.5, validationY, { align: 'center' });

        const linkText = 'Verificar autenticidad en línea en www.certiwebs.com/verificar.html';
        const textWidth = doc.getTextWidth(linkText);
        doc.setTextColor(brandColors.neonGreen[0], brandColors.neonGreen[1], brandColors.neonGreen[2]);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.text(linkText, 148.5, validationY + 3.8, { align: 'center' });

        // Enlace interactivo directamente dentro del PDF
        doc.link(148.5 - textWidth / 2, validationY + 1.2, textWidth, 4, { url: verificationUrl });
    }

    // Descarga del Archivo PDF
    doc.save(`certificado_${examId}_${username}.pdf`);
};

// Manejadores de eventos para formularios
runOnDOMReady(() => {
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
            const typeEl = document.getElementById('contact-type');
            const type = typeEl ? typeEl.value : 'Consulta General';
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
                    body: JSON.stringify({ name, email, type, subject, message })
                });

                const data = await response.json();

                if (response.ok) {
                    statusEl.innerHTML = `<strong>${data.mensaje || '¡Mensaje enviado correctamente!'}</strong><br/><small>Se registraron tus datos en el sistema bajo el Ticket <strong>${data.ticket || ''}</strong>.</small>`;
                    statusEl.className = 'status-message status-success';
                    contactoForm.reset();

                    // Redirigir después de 4 segundos
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 4000);
                } else {
                    throw new Error(data.error || 'Error al enviar mensaje');
                }
            } catch (error) {
                console.error('Error en contacto:', error);
                statusEl.textContent = error.message || 'Error al enviar el mensaje. Por favor intenta nuevamente.';
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

    // Formulario de Boletín de Novedades (Newsletter)
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        console.log('Formulario de newsletter encontrado');
        newsletterForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const emailInput = document.getElementById('newsletter-email');
            const msgEl = document.getElementById('newsletter-status');
            const email = emailInput.value.trim();

            if (!email) return;

            msgEl.textContent = 'Procesando suscripción...';
            msgEl.className = 'newsletter-status status-info';
            msgEl.style.display = 'block';
            msgEl.style.color = 'var(--neon-cyan)';

            try {
                const response = await fetch(`${API_URL}/newsletter`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email })
                });

                const data = await response.json();

                if (response.ok) {
                    msgEl.textContent = data.mensaje || '¡Te has suscrito exitosamente!';
                    msgEl.className = 'newsletter-status status-success';
                    msgEl.style.color = 'var(--neon-green)';
                    newsletterForm.reset();
                } else {
                    throw new Error(data.error || 'Error al suscribirse');
                }
            } catch (error) {
                console.error('Error en newsletter:', error);
                msgEl.textContent = error.message || 'Error al conectar con el servidor.';
                msgEl.className = 'newsletter-status status-error';
                msgEl.style.color = 'var(--neon-red)';
            }

            setTimeout(() => {
                msgEl.style.display = 'none';
            }, 5000);
        });
    }

    // Función para inicializar el formulario de login cuando se abra el modal
    function initializeLoginForm() {
        const loginForm = document.getElementById('login-form');
        console.log('Formulario login encontrado:', loginForm);

        if (loginForm && !loginForm.hasAttribute('data-initialized')) {
            loginForm.addEventListener('submit', async (e) => {
                console.log('Submit de login activado');
                e.preventDefault();

                const email = document.getElementById('login-email').value.trim();
                const password = document.getElementById('login-password').value;
                const msgElement = loginForm.querySelector('.login-msg');

                console.log('Intentando login con email:', email);
                console.log('Password length:', password.length);
                console.log('API URL:', API_URL);

                try {
                    const response = await fetch(`${API_URL}/login`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ email, password })
                    });

                    console.log('Response status:', response.status);
                    const data = await response.json();
                    console.log('Response data:', data);

                    if (response.ok) {
                        console.log('Login exitoso');
                        sessionStorage.setItem('token', data.token);
                        sessionStorage.setItem('username', data.username);
                        sessionStorage.setItem('userId', data.id);
                        sessionStorage.setItem('rol', data.rol || 'usuario');
                        sessionStorage.setItem('email', data.email || '');

                        // Mostrar mensaje de éxito personalizado
                        if (msgElement) {
                            const rolLabel = data.rol === 'admin' ? ' <span style="color:var(--neon-orange);">[Admin]</span>' : '';
                            msgElement.innerHTML = `¡Bienvenido/a <strong>${data.username}</strong>${rolLabel}! 🎉<br>Sesión iniciada correctamente. Redirigiendo...`;
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
            const passwordConfirm = document.getElementById('register-password-confirm').value;
            const email = document.getElementById('register-email').value;
            const msgElement = registerForm.querySelector('.register-msg');

            if (password !== passwordConfirm) {
                utils.mostrarMensaje(msgElement, 'Las contraseñas no coinciden', 'error');
                return;
            }

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
                sessionStorage.setItem('rol', data.rol || 'usuario');
                sessionStorage.setItem('email', data.email || '');

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
runOnDOMReady(function () {
    console.log('DOM cargado, verificando página de exámenes...');

    if (window.location.pathname.endsWith('exams.html')) {
        console.log('Página de exámenes detectada');

        // Verificar autenticación
        const usuario = utils.getUsuarioActual();
        const token = sessionStorage.getItem('token');
        console.log('Usuario:', usuario);

        if (!usuario.id || !token) {
            console.log('Usuario no autenticado, redirigiendo...');
            utils.cerrarSesion();
            return;
        }

        // Mostrar link a la presentación si el correo es octaarami@gmail.com
        const email = sessionStorage.getItem('email');
        const navPres = document.getElementById('nav-presentacion');
        if (navPres) {
            navPres.style.display = (email === 'octaarami@gmail.com') ? 'inline-block' : 'none';
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
            <div style="display: flex; align-items: center; gap: 1rem; text-align: left;">
                <div style="font-size: 2.2rem; filter: drop-shadow(0 0 5px var(--neon-green));">👋</div>
                <div>
                    <h4 style="margin: 0; color: var(--neon-green); text-shadow: 0 0 10px rgba(0,255,136,0.4); font-weight: 700; font-size: 1.15rem;">¡Bienvenido/a de vuelta!</h4>
                    <p style="margin: 0; color: #f8fafc; opacity: 0.95; font-size: 0.92rem;">Hola <strong>${usuario.username}</strong>, ¿qué examen tomarás hoy?</p>
                </div>
            </div>
        `;
        welcomeMessage.style.cssText = `
            background: rgba(15, 23, 42, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid var(--neon-green);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            max-width: 480px;
            margin: 2rem auto 1rem auto;
            box-shadow: 0 0 20px rgba(0, 255, 136, 0.2);
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
            logoutBtn.addEventListener('click', function () {
                utils.cerrarSesion();
            });
        }

        // Mostrar badge de admin si corresponde
        const rol = sessionStorage.getItem('rol') || 'usuario';
        const usernameDisplayEl = document.getElementById('username-display');
        if (usernameDisplayEl) {
            const adminBadge = rol === 'admin'
                ? ` <span style="background:rgba(255,107,53,0.15); border:1px solid var(--neon-orange); color:var(--neon-orange); font-size:0.65rem; font-weight:700; padding:0.15rem 0.5rem; border-radius:20px; text-transform:uppercase; letter-spacing:1px; vertical-align:middle;"><i class='fas fa-shield-alt'></i> Admin</span>`
                : '';
            usernameDisplayEl.innerHTML = `<i class="fas fa-user-circle"></i> ${usuario.username}${adminBadge}`;
        }

        // Mostrar link al panel de admin si es administrador
        if (rol === 'admin') {
            const adminLink = document.createElement('div');
            adminLink.style.cssText = 'text-align:center; margin-bottom:1rem;';
            adminLink.innerHTML = `
                <a href="admin.html" style="display:inline-flex; align-items:center; gap:0.5rem; background:rgba(255,107,53,0.1); border:1px solid var(--neon-orange); color:var(--neon-orange); padding:0.5rem 1.5rem; border-radius:30px; text-decoration:none; font-size:0.9rem; font-weight:600; transition:all 0.3s;" onmouseover="this.style.background='rgba(255,107,53,0.2)'" onmouseout="this.style.background='rgba(255,107,53,0.1)'">
                    <i class="fas fa-shield-alt"></i> Panel de Administrador
                </a>
            `;
            const mainContainer = document.querySelector('.container');
            if (mainContainer) mainContainer.parentNode.insertBefore(adminLink, mainContainer);
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

        // Cargar historial de exámenes
        cargarHistorial();

        async function cargarHistorial() {
            const historySection = document.getElementById('history-section');
            const historyList = document.getElementById('history-list');
            if (!historySection || !historyList) return;

            try {
                const [intentos, certificados] = await Promise.all([
                    examenes.obtenerHistorial().catch(() => []),
                    utils.fetchAPI(`certificados/${usuario.id}`).catch(() => [])
                ]);

                if (intentos.length > 0) {
                    historySection.style.display = 'block';
                    historyList.innerHTML = '';

                    const table = document.createElement('table');
                    table.className = 'history-table';
                    table.innerHTML = `
                        <thead>
                            <tr>
                                <th>Examen</th>
                                <th>Fecha / Hora</th>
                                <th>Puntaje</th>
                                <th>Estado</th>
                                <th>Certificado</th>
                            </tr>
                        </thead>
                        <tbody>
                        </tbody>
                    `;

                    const tbody = table.querySelector('tbody');
                    intentos.forEach(intento => {
                        const aprobado = intento.puntuacion >= 60;
                        const dateObj = utils.parseSQLiteDate(intento.fecha);
                        const fechaFormatted = dateObj.toLocaleString('es-ES', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                        });

                        const cert = certificados.find(c => c.examen_id === intento.examen_id);
                        let certAction = '-';
                        if (aprobado && cert) {
                            certAction = `<button class="btn-principal small" onclick="descargarCertificadoHistorico('${intento.examen_id}', ${intento.puntuacion}, '${cert.codigo_verificacion}', '${cert.fecha_emision}')" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 0.4rem !important; min-width: 140px !important; height: 32px !important; border-radius: 16px !important; font-size: 0.8rem !important; background: var(--neon-green) !important; color: #000 !important; border: none !important; box-shadow: 0 0 10px rgba(0, 255, 136, 0.25) !important;">
                                <i class="fas fa-download"></i> Descargar
                            </button>`;
                        } else if (aprobado) {
                            certAction = `<button class="btn-principal small" onclick="generarYDescargarCertificado('${intento.examen_id}', ${intento.puntuacion}, '${intento.fecha}')" style="display: inline-flex !important; align-items: center !important; justify-content: center !important; gap: 0.4rem !important; min-width: 140px !important; height: 32px !important; border-radius: 16px !important; font-size: 0.8rem !important; background: var(--neon-orange) !important; color: #fff !important; border: none !important; box-shadow: 0 0 10px rgba(255, 107, 53, 0.25) !important;">
                                <i class="fas fa-magic"></i> Generar PDF
                            </button>`;
                        }

                        const tr = document.createElement('tr');
                        tr.innerHTML = `
                            <td><strong style="color: var(--neon-cyan);">${intento.examen_id.toUpperCase()}</strong></td>
                            <td style="color: #cbd5e1;">${fechaFormatted}</td>
                            <td style="font-weight: 700; color: #fff;">${intento.puntuacion}%</td>
                            <td>
                                <span class="${aprobado ? 'badge-aprobado' : 'badge-desaprobado'}">
                                    ${aprobado ? 'Aprobado' : 'Desaprobado'}
                                </span>
                            </td>
                            <td>${certAction}</td>
                        `;
                        tbody.appendChild(tr);
                    });
                    historyList.appendChild(table);
                } else {
                    historySection.style.display = 'none';
                }
            } catch (err) {
                console.error('Error al cargar historial:', err);
            }
        }

        window.descargarCertificadoHistorico = async function (examId, score, codigoVerificacion, fechaEmision) {
            await window.generarCertificadoPDF(usuario.username, examId, score, codigoVerificacion, fechaEmision);
        };

        window.generarYDescargarCertificado = async function (examId, score, fechaExamen) {
            try {
                // Intentar crear el certificado en el servidor
                const certRes = await examenes.crearCertificado(usuario.id, examId);
                const codigo = certRes.codigo_verificacion;
                // Descargar el PDF con el código recién creado
                await window.generarCertificadoPDF(usuario.username, examId, score, codigo, fechaExamen);
                // Recargar el historial para que cambie a verde (Descargar)
                cargarHistorial();
            } catch (err) {
                console.error('Error al generar certificado al vuelo:', err);
                // Fallback: descargar con un código temporal para no bloquear al usuario
                const tempCode = `CERT-${examId.toUpperCase()}-${Date.now()}`;
                await window.generarCertificadoPDF(usuario.username, examId, score, tempCode, fechaExamen);
            }
        };
    }
});

// Manejo del examen
runOnDOMReady(function () {
    if (window.location.pathname.endsWith('exam.html')) {
        console.log('Página de examen individual detectada');

        const usuario = utils.getUsuarioActual();
        const token = sessionStorage.getItem('token');
        console.log('Usuario:', usuario);

        if (!usuario.id || !token) {
            console.log('Usuario no autenticado, redirigiendo...');
            utils.cerrarSesion();
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

        // Obtener el pool de preguntas original de la materia
        const questionPool = examQuestions[examId];
        if (!questionPool || questionPool.length === 0) {
            console.error('No hay preguntas para el examen:', examId);
            document.getElementById('loading').style.display = 'none';
            document.getElementById('error').style.display = 'block';
            document.getElementById('error').textContent = 'No hay preguntas disponibles para este examen';
            return;
        }

        // Barajar (Shuffle) y seleccionar de forma aleatoria (limitando al número indicado en el examen)
        const limit = examData.preguntas || 10;
        const shuffledPool = [...questionPool].sort(() => 0.5 - Math.random());
        const questions = shuffledPool.slice(0, limit);

        // Inyectar tema de color dinámico en el DOM (Verde neón CertiWebs)
        const activeThemeColor = '#00ff88';
        document.documentElement.style.setProperty('--theme-color', activeThemeColor);

        const styleTag = document.createElement('style');
        styleTag.innerHTML = `
            .question-number {
                color: var(--theme-color) !important;
            }
            .timer {
                color: var(--theme-color) !important;
                border-color: rgba(255, 255, 255, 0.06) !important;
            }
            .option:hover {
                background: rgba(0, 255, 136, 0.04) !important;
                border-color: var(--theme-color) !important;
                box-shadow: 0 0 10px rgba(0, 255, 136, 0.1) !important;
                transform: translateX(10px) !important;
            }
            .option.selected {
                background: rgba(0, 255, 136, 0.08) !important;
                border-color: var(--theme-color) !important;
                box-shadow: 0 0 15px var(--theme-color) !important;
            }
            .option input[type="radio"] {
                accent-color: var(--theme-color) !important;
            }
            .progress-dot.active {
                background: var(--theme-color) !important;
                color: #000 !important;
                box-shadow: 0 0 12px var(--theme-color) !important;
            }
            .progress-dot.completed {
                background: rgba(0, 255, 136, 0.15) !important;
                border-color: var(--theme-color) !important;
                color: var(--theme-color) !important;
            }
            .btn-submit {
                background: var(--theme-color) !important;
                color: #000 !important;
                font-weight: 700 !important;
                box-shadow: 0 0 15px var(--theme-color) !important;
                border: none !important;
            }
            .btn-principal {
                background: var(--theme-color) !important;
                color: #000 !important;
                font-weight: 700 !important;
                box-shadow: 0 0 15px var(--theme-color) !important;
                border: none !important;
            }
        `;
        document.head.appendChild(styleTag);

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
            timerEl.innerHTML = `<i class="far fa-clock"></i> ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            timerInterval = setInterval(() => {
                timeLeft--;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerEl.innerHTML = `<i class="far fa-clock"></i> ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                if (timeLeft <= 60) {
                    timerEl.classList.add('warning');
                }

                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    console.log('Tiempo agotado, enviando examen automáticamente');
                    submitExam(true);
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

        // Saltar directamente a una pregunta al hacer clic en los dots
        window.goToQuestion = function (index) {
            if (index >= 0 && index < questions.length) {
                currentQuestion = index;
                showQuestion();
            }
        };

        // Seleccionar opción
        window.selectOption = function (index) {
            console.log('Seleccionando opción', index, 'para la pregunta', currentQuestion);
            answers[currentQuestion] = index;
            showQuestion();
        };

        // Actualizar progreso
        function updateProgress() {
            const progressEl = document.getElementById('progress');
            progressEl.innerHTML = questions.map((_, index) => {
                let stateClass = '';
                if (index < currentQuestion) stateClass = 'completed';
                if (index === currentQuestion) stateClass = 'active';

                const dotContent = (index + 1);

                return `<div class="progress-dot ${stateClass}" onclick="goToQuestion(${index})">${dotContent}</div>`;
            }).join('');
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
        window.previousQuestion = function () {
            if (currentQuestion > 0) {
                currentQuestion--;
                showQuestion();
                console.log('Navegando a la pregunta anterior:', currentQuestion + 1);
            } else {
                console.log('Ya estás en la primera pregunta');
            }
        };

        window.nextQuestion = function () {
            if (currentQuestion < questions.length - 1) {
                currentQuestion++;
                showQuestion();
                console.log('Navegando a la siguiente pregunta:', currentQuestion + 1);
            } else {
                console.log('Ya estás en la última pregunta');
            }
        };

        // Enviar examen
        window.submitExam = async function (isForced = false) {
            console.log('Iniciando envío del examen...');

            // Validar que todas las preguntas tengan respuesta
            let unansweredQuestions = [];
            questions.forEach((question, index) => {
                if (answers[index] === undefined || answers[index] === null || answers[index] === '') {
                    unansweredQuestions.push(index + 1);
                }
            });

            if (!isForced && unansweredQuestions.length > 0) {
                const confirmSubmit = confirm(`Tienes preguntas sin responder: ${unansweredQuestions.join(', ')}\n\n¿Deseas enviar el examen de todas formas?`);
                if (!confirmSubmit) {
                    return;
                }
            }

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

                let codigoVerificacion = null;

                // Si aprobó (60% o más), crear certificado automáticamente
                if (score >= 60) {
                    try {
                        const certRes = await examenes.crearCertificado(usuario.id, examId);
                        codigoVerificacion = certRes.codigo_verificacion;
                        console.log('Certificado creado automáticamente con código:', codigoVerificacion);
                    } catch (certError) {
                        console.error('Error creando certificado:', certError);
                        // No fallamos el proceso si el certificado falla
                    }
                }

                // Guardar resultados en sessionStorage para result.html
                const resultadoCompleto = {
                    exam: examId,
                    score: score,
                    correct: correct,
                    total: questions.length,
                    answers: answers,
                    questions: questions,
                    codigo_verificacion: codigoVerificacion
                };
                sessionStorage.setItem('certiweb_last_result', JSON.stringify(resultadoCompleto));

                window.location.href = `result.html?exam=${examId}&score=${score}&correct=${correct}&total=${questions.length}`;
            } catch (error) {
                console.error('Error guardando resultado:', error);
                alert('Error al guardar el resultado. Por favor intenta nuevamente.');
            }
        };

        // Mostrar pantalla de bienvenida del examen en lugar del contenido del examen directamente
        document.getElementById('loading').style.display = 'none';
        document.getElementById('exam-content').style.display = 'block';

        const examContentEl = document.getElementById('exam-content');
        examContentEl.innerHTML = `
            <div class="exam-intro-card">
                <i class="fas fa-graduation-cap" style="font-size: 3.5rem; color: var(--theme-color); margin-bottom: 1.5rem; filter: drop-shadow(0 0 10px rgba(0, 255, 136, 0.3));"></i>
                <h3>Certificación en ${examData.nombre}</h3>
                <p>${examData.descripcion}</p>
                <div class="exam-intro-rules">
                    <div class="intro-rule-item">
                        <i class="fas fa-question-circle"></i>
                        <span>${questions.length}</span>
                        <small>Preguntas</small>
                    </div>
                    <div class="intro-rule-item">
                        <i class="fas fa-clock"></i>
                        <span>${Math.floor(examData.tiempo / 60)} min</span>
                        <small>Tiempo</small>
                    </div>
                    <div class="intro-rule-item">
                        <i class="fas fa-award"></i>
                        <span>60%</span>
                        <small>Aprobar con</small>
                    </div>
                </div>
                <button class="btn-start-exam" onclick="comenzarExamenReal()">Comenzar Examen</button>
            </div>
        `;

        window.comenzarExamenReal = function () {
            // Mostrar cabecera y controles
            const examHeader = document.querySelector('.exam-header');
            if (examHeader) examHeader.style.display = 'flex';
            document.getElementById('navigation').style.display = 'flex';

            console.log('Iniciando examen real...');
            showQuestion();
            startTimer();
        };
    }
});

// --- RESULTADO Y CERTIFICADO PDF ---
runOnDOMReady(function () {
    if (window.location.pathname.endsWith('result.html')) {
        const usuario = utils.getUsuarioActual();
        if (!usuario || !usuario.username) window.location.href = 'index.html';
        const result = JSON.parse(sessionStorage.getItem('certiweb_last_result') || 'null');
        const section = document.getElementById('result-section');
        if (!result) {
            section.innerHTML = '<p class="text-center" style="color: var(--text-muted); font-size: 1.2rem; margin-top: 3rem;">No hay resultados para mostrar.</p>';
        } else {
            // Inyectar tema de color dinámico en el DOM (Restaurado a Verde)
            const themeColors = {
                html: '#00ff88',
                css: '#00ff88',
                js: '#00ff88',
                redes: '#00ff88',
                so: '#00ff88'
            };
            const activeThemeColor = '#00ff88';
            document.documentElement.style.setProperty('--theme-color', activeThemeColor);

            const styleTag = document.createElement('style');
            styleTag.innerHTML = `
            #verRespuestas {
                border-color: var(--theme-color) !important;
                color: var(--theme-color) !important;
            }
            #verRespuestas:hover {
                background: var(--theme-color) !important;
                color: #000 !important;
            }
            .result-top.approved .medal-ring {
                color: var(--theme-color) !important;
                border-color: var(--theme-color) !important;
                box-shadow: 0 0 20px var(--theme-color) !important;
            }
            .result-top.approved h2 {
                color: var(--theme-color) !important;
                text-shadow: 0 0 10px var(--theme-color) !important;
            }
            .review-section h2 {
                color: var(--theme-color) !important;
                text-shadow: 0 0 10px var(--theme-color) !important;
            }
            .review-section span[style*="var(--neon-cyan)"] {
                color: var(--theme-color) !important;
            }
            #descargarPDF {
                background: var(--theme-color) !important;
                color: #000 !important;
                font-weight: 700 !important;
                box-shadow: 0 0 15px var(--theme-color) !important;
                border: none !important;
            }
        `;
            document.head.appendChild(styleTag);

            const aprobado = result.score >= 60;
            section.innerHTML = `
            <div class="result-card">
                <div class="result-top ${aprobado ? 'approved' : 'failed'}" style="margin-bottom: 2rem;">
                    <div class="result-badge-medal ${aprobado ? 'approved' : 'failed'}">
                        <div class="medal-ring">
                            <i class="fas ${aprobado ? 'fa-check-circle' : 'fa-times-circle'}"></i>
                        </div>
                        <div class="score-badge-overlay">${result.score}%</div>
                    </div>
                    <div class="result-summary" style="text-align: left;">
                        <h2 style="color: ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'}; font-size: 2.2rem; margin-bottom: 0.5rem; text-shadow: 0 0 10px ${aprobado ? 'rgba(0,255,136,0.2)' : 'rgba(255,51,102,0.2)'};">
                            ${aprobado ? '¡Examen Aprobado!' : 'Examen Reprobado'}
                        </h2>
                        <div class="sub" style="font-size: 1.1rem; color: var(--text-muted);">
                            Puntuación obtenida: <strong>${result.score}%</strong> (${result.correct} de ${result.total} respuestas correctas)
                        </div>
                        <div class="message" style="color: #fff; font-size: 1.05rem; margin-top: 0.8rem; font-weight: 500; opacity: 0.9;">
                            ${aprobado ? '¡Felicidades! Has cumplido con los requisitos de conocimientos técnicos para obtener esta certificación.' : 'No has alcanzado el puntaje mínimo de 60% requerido para aprobar esta evaluación.'}
                        </div>
                    </div>
                </div>

                <div class="result-details">
                    <div>
                        <span class="result-label">Materia</span>
                        <strong class="result-value">${result.exam.toUpperCase()}</strong>
                    </div>
                    <div>
                        <span class="result-label">Alumno</span>
                        <strong class="result-value">${usuario.username}</strong>
                    </div>
                    <div>
                        <span class="result-label">Estado</span>
                        <strong class="result-value" style="color: ${aprobado ? 'var(--neon-green)' : 'var(--neon-red)'};">${aprobado ? 'Aprobado' : 'Desaprobado'}</strong>
                    </div>
                    <div>
                        <span class="result-label">Verificación</span>
                        <a href="verificar.html?code=${result.codigo_verificacion || ''}" class="result-value" style="color: var(--neon-cyan); font-family: monospace; text-decoration: underline; display: block; margin-top: 0.2rem;">
                            ${result.codigo_verificacion || 'N/A'}
                        </a>
                    </div>
                </div>

                <div class="result-actions" style="display: flex; flex-direction: column; gap: 1.5rem; align-items: center;">
                    <div class="result-main-actions" style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; width: 100%;">
                        <button id="verRespuestas" class="btn-principal small" style="background: transparent; border: 1px solid var(--neon-cyan); color: var(--neon-cyan); box-shadow: none;">
                            <i class="fas fa-tasks"></i> Ver respuestas
                        </button>
                        ${aprobado ? `
                        <button id="descargarPDF" class="btn-submit small">
                            <i class="fas fa-file-pdf"></i> Descargar certificado PDF
                        </button>
                        ` : ''}
                        <a href="exams.html" class="btn-exam small" style="text-decoration: none;">
                            <i class="fas fa-arrow-left"></i> Volver a exámenes
                        </a>
                    </div>
                    
                    ${aprobado ? `
                    <div class="result-social-actions" style="display: flex; flex-direction: column; align-items: center; gap: 0.8rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1.5rem; width: 100%;">
                        <span style="color: var(--text-muted); font-size: 0.95rem; font-weight: 500;">¡Comparte tu logro profesional con el mundo!</span>
                        <div style="display: flex; gap: 1rem; justify-content: center;">
                            <button class="btn-social twitter" id="shareTwitter" title="Compartir en Twitter" style="width: 46px; height: 46px; border-radius: 50%; font-size: 1.2rem;">
                                <i class="fab fa-twitter"></i>
                            </button>
                            <button class="btn-social linkedin" id="shareLinkedIn" title="Compartir en LinkedIn" style="width: 46px; height: 46px; border-radius: 50%; font-size: 1.2rem;">
                                <i class="fab fa-linkedin-in"></i>
                            </button>
                        </div>
                    </div>
                    ` : ''}
                </div>
            </div>
        `;

            document.getElementById('verRespuestas').onclick = function () {
                let html = `
                <div class="review-section" style="max-width: 800px; margin: 0 auto;">
                    <h2 class="text-center mb-4" style="color: var(--neon-cyan); text-shadow: var(--border-glow); font-size: 2.2rem;">Revisión de Respuestas</h2>
                    <div style="display: flex; flex-direction: column; gap: 1.5rem; margin-bottom: 2.5rem;">
                `;
                const examId = result.exam;
                const questions = result.questions || examQuestions[examId];
                // answers puede ser objeto {0:x, 1:y} o array; normalizamos a array
                const answersArr = Array.isArray(result.answers)
                    ? result.answers
                    : questions.map((_, i) => (result.answers[i] !== undefined ? result.answers[i] : null));
                
                answersArr.forEach((a, i) => {
                    const esCorrecta = a === questions[i].a;
                    const borderLeftColor = esCorrecta ? 'var(--neon-green)' : 'var(--neon-red)';
                    const badgeBgColor = esCorrecta ? 'rgba(0, 255, 136, 0.1)' : 'rgba(255, 51, 102, 0.1)';
                    const badgeTextColor = esCorrecta ? 'var(--neon-green)' : 'var(--neon-red)';
                    const badgeText = esCorrecta ? 'Correcta' : 'Incorrecta';

                    html += `
                    <div class="answer-card" style="border-left: 6px solid ${borderLeftColor}; padding: 1.5rem; background: rgba(15, 23, 42, 0.6); border-radius: 12px; text-align: left; border-top: 1px solid rgba(255,255,255,0.02); border-right: 1px solid rgba(255,255,255,0.02); border-bottom: 1px solid rgba(255,255,255,0.02);">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                            <span style="color: var(--neon-cyan); font-weight: 600; font-size: 0.9rem; text-transform: uppercase; letter-spacing: 0.5px;">Pregunta ${i + 1}</span>
                            <span style="background: ${badgeBgColor}; color: ${badgeTextColor}; border: 1px solid ${borderLeftColor}; font-size: 0.8rem; padding: 0.2rem 0.6rem; border-radius: 20px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">${badgeText}</span>
                        </div>
                        <p style="color: #fff; font-size: 1.1rem; margin-bottom: 1.2rem; font-weight: 500; line-height: 1.4;">${questions[i].q}</p>
                        <div style="display: flex; flex-direction: column; gap: 0.6rem; background: rgba(0,0,0,0.25); padding: 1rem; border-radius: 8px; border: 1px solid rgba(255,255,255,0.03);">
                            <div style="font-size: 0.95rem; color: var(--text-muted);">
                                Tu respuesta: <strong style="color: ${esCorrecta ? 'var(--neon-green)' : 'var(--neon-red)'}; font-size: 1rem;">${questions[i].o[a] !== undefined ? questions[i].o[a] : 'Sin respuesta'}</strong>
                            </div>
                            ${!esCorrecta ? `
                            <div style="font-size: 0.95rem; color: var(--text-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top: 0.5rem; margin-top: 0.3rem;">
                                Respuesta correcta: <strong style="color: var(--neon-green); font-size: 1rem;">${questions[i].o[questions[i].a]}</strong>
                            </div>
                            ` : ''}
                        </div>
                        
                        ${questions[i].exp ? `
                        <div class="explanation-box">
                            <div class="explanation-title">
                                <i class="far fa-lightbulb"></i> Explicación teórica
                            </div>
                            <p class="explanation-text">${questions[i].exp}</p>
                        </div>
                        ` : ''}
                    </div>
                    `;
                });
                html += `
                    </div>
                    <div class="text-center">
                        <a href="result.html" class="btn-principal small" style="text-decoration: none; display: inline-flex; align-items: center; justify-content: center; width: 220px; height: 46px; border-radius: 23px; font-size: 0.95rem;">
                            <i class="fas fa-arrow-left"></i> Volver a resultados
                        </a>
                    </div>
                </div>
                `;
                section.innerHTML = html;
            };

            if (aprobado) {
                // Configurar botones de compartir
                const shareUrl = result.codigo_verificacion
                    ? `${window.location.origin}/verificar.html?code=${result.codigo_verificacion}`
                    : `${window.location.origin}`;
                const shareText = `¡He aprobado con éxito el examen de certificación en ${result.exam.toUpperCase()} en CertiWebs! 🎓💻 Obtuve un puntaje de ${result.score}%. Puedes comprobar la validez de mi certificado aquí:`;

                const shareTwitterBtn = document.getElementById('shareTwitter');
                if (shareTwitterBtn) {
                    shareTwitterBtn.onclick = function () {
                        const twitterIntent = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
                        window.open(twitterIntent, '_blank', 'noopener,noreferrer');
                    };
                }

                const shareLinkedInBtn = document.getElementById('shareLinkedIn');
                if (shareLinkedInBtn) {
                    shareLinkedInBtn.onclick = function () {
                        const linkedinIntent = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
                        window.open(linkedinIntent, '_blank', 'noopener,noreferrer');
                    };
                }

                document.getElementById('descargarPDF').onclick = async function () {
                    await window.generarCertificadoPDF(usuario.username, result.exam, result.score, result.codigo_verificacion, new Date().toISOString());
                };
            }
        }
    }
});


