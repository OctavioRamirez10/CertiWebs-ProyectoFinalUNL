# 🎓 Guía de Defensa y Banco de Respuestas - CertiWebs

Este documento sirve como material de apoyo definitivo para la presentación final de tu proyecto. Está diseñado para ayudarte a defender la arquitectura del sistema frente al jurado evaluador.

---

## 1. 📂 Estructura Recomendada para tu Presentación (Diapositivas)

Si debes preparar diapositivas, sigue esta estructura para contar una historia clara y convincente:

*   **Diapositiva 1: Portada e Introducción**
    *   **Título**: *CertiWebs: Plataforma Interactiva de Guías de Estudio y Certificación Técnica.*
    *   **Presentación**: Nombre del estudiante, carrera y fecha.
    *   **Gancho Inicial**: *"El mercado laboral tecnológico exige validar conocimientos rápidamente. CertiWebs resuelve esto uniendo educación interactiva y acreditación en una sola aplicación fluida."*
*   **Diapositiva 2: El Problema y la Solución**
    *   **Problema**: Cursos tradicionales aburridos, exámenes estáticos y repetitivos, y servidores web sobrecargados por generar recursos complejos (como PDFs) del lado del servidor.
    *   **Solución**: Guías de estudio modernas + motor de exámenes aleatorios + generación local de diplomas interactivos de alta seguridad y nulo consumo de CPU del servidor.
*   **Diapositiva 3: Arquitectura Tecnológica (Stack)**
    *   **Frontend**: HTML5 Semántico, CSS3 Vanilla (diseño Responsive Neón), JavaScript Puro (sin frameworks pesados para garantizar máxima velocidad de carga).
    *   **Backend**: Node.js + Express (API REST segura, modular y liviana).
    *   **Base de Datos**: SQLite3 (base relacional compacta integrada, ideal para despliegues ágiles y prototipos rápidos).
    *   **Seguridad**: Hashing de contraseñas con `bcrypt` y control de sesiones mediante tokens JWT (JSON Web Tokens).
*   **Diapositiva 4: El Motor de Exámenes y el Temporizador**
    *   **Dinámica**: Banco de 20 preguntas por materia. Selección aleatoria de 5 mediante ordenación aleatoria en JS.
    *   **Temporizador**: Control asíncrono con `setInterval`. Alerta de UI en rojo pulsante al restar menos de 60 segundos. Autocierre y envío forzado al llegar a 0.
*   **Diapositiva 5: Generación y Validación de PDF**
    *   **Client-Side PDF**: Uso de `jsPDF` del lado del navegador.
    *   **Estética y Seguridad**: Canvas offscreen para el fondo, trazos vectoriales y curvas Bézier nativas, filtros de luminancia en tiempo real para digitalizar firmas y enlace interactivo de verificación.
    *   **Verificación**: Portal público de autenticación que consulta directamente a la base de datos mediante el ID del certificado.
*   **Diapositiva 6: Demostración en Vivo**
    *   Muestra el flujo: Iniciar sesión $\rightarrow$ Navegar por las guías $\rightarrow$ Rendir un examen (mostrando el timer y la barra de navegación) $\rightarrow$ Aprobar y descargar el PDF $\rightarrow$ Copiar el código del PDF y verificarlo en el portal de verificación.
*   **Diapositiva 7: Conclusiones y Trabajo Futuro**
    *   Logros: Sistema robusto, seguro y escalable.
    *   Mejoras futuras: Panel administrativo completo para agregar preguntas en vivo, e integración con bases de datos en la nube como PostgreSQL.

---

## 2. ❓ Preguntas del Jurado y Respuestas Estratégicas (Defensa)

A continuación, se listan las preguntas más frecuentes de los profesores y cómo responderlas para impresionarlos:

### P1: ¿Por qué elegiste SQLite en lugar de MySQL o PostgreSQL?
> * **Respuesta clave**: *"Elegí **SQLite** porque es una base de datos relacional sin servidor ('serverless') que almacena toda la información en un único archivo de disco (`certiweb.db`). Esto la hace extremadamente ligera, veloz para lecturas y perfecta para entornos de desarrollo y hosting de demostración. Si el sistema escala a miles de usuarios concurrentes escribiendo datos al mismo tiempo, el cambio a PostgreSQL es sumamente sencillo ya que la lógica de acceso está modularizada y el lenguaje utilizado es SQL estándar."*

### P2: ¿Cómo funciona la seguridad y las sesiones de usuario en tu API?
> * **Respuesta clave**: *"La autenticación se maneja mediante **JWT (JSON Web Tokens)**. Cuando el usuario inicia sesión de forma correcta (validando su contraseña con `bcrypt.compare`), el backend genera un token firmado con una clave secreta (`JWT_SECRET`). Este token es enviado al cliente, quien lo almacena en el `sessionStorage`. Para cada petición a rutas protegidas (como guardar resultados o crear certificados), el cliente envía el token en la cabecera `Authorization: Bearer <token>`. El servidor utiliza un middleware (`verificarToken`) para decodificarlo, verificar su autenticidad y extraer de forma segura el ID del usuario, evitando accesos no autorizados."*

### P3: ¿Por qué generar el certificado PDF en el cliente y no en el servidor (backend)?
> * **Respuesta clave**: *"Generar PDFs en el servidor mediante herramientas como Puppeteer o librerías pesadas consume muchísima memoria RAM y CPU del servidor. Al implementar **jsPDF en el frontend**, delegamos ese procesamiento gráfico al navegador del propio usuario. Esto libera de carga al servidor de Node.js, reduciendo costos operativos, mejorando la velocidad de respuesta del servidor y permitiendo que la aplicación funcione eficientemente en entornos con recursos limitados (como Render o Vercel)."*

### P4: ¿Cómo aseguraron que los certificados PDF no puedan ser falsificados fácilmente?
> * **Respuesta clave**: *"Implementamos un sistema de verificación pública de doble vía. Cuando un estudiante aprueba un examen, el backend registra un certificado en la base de datos con un código criptográfico único que contiene metadatos embebidos (ej: `CERT-HTML-timestamp`). Este código se imprime en el PDF con un enlace interactivo clicable que redirige a nuestro sitio web (`verificar.html`). Si alguien altera visualmente el nombre en el PDF, el verificador en línea consultará directamente a la base de datos de SQLite usando el código y expondrá los datos reales del estudiante original, invalidando la falsificación."*

### P5: ¿Cómo funciona el filtro de las firmas electrónicas dentro del PDF?
> * **Respuesta clave**: *"Para que las firmas institucionales se vean profesionales sobre el fondo azul noche del certificado, creamos un algoritmo de procesamiento de imágenes usando la API Canvas de HTML5. El script carga las imágenes de las firmas en un canvas oculto, itera sobre la matriz de píxeles (`getImageData`), calcula la luminosidad de cada píxel, hace totalmente transparente el fondo blanco (luminancia > 220) y tiñe los trazos oscuros con los colores neón del certificado. Posteriormente, exportamos ese resultado como un DataURL PNG transparente y lo insertamos en el PDF."*

---

## 3. 📝 Banco de Respuestas de los Exámenes (100 Preguntas)

A continuación, tienes el catálogo completo de preguntas estructurado por materia, con sus opciones, la respuesta correcta destacada y la justificación teórica.

---

### 🌐 HTML (Módulo de Desarrollo Web Frontend)

1.  **¿Qué significa HTML?**
    *   [x] **A) HyperText Markup Language**
    *   [ ] **B)** Home Tool Markup Language
    *   [ ] **C)** Hyperlinks and Text Markup Language
    *   *Justificación*: HTML es el estándar de estructura para la web (Lenguaje de Marcado de Hipertexto).
2.  **¿Etiqueta para salto de línea en HTML?**
    *   [x] **A) `<br>`**
    *   [ ] **B)** `<lb>`
    *   [ ] **C)** `<break>`
    *   *Justificación*: Produce un salto de línea simple sin iniciar un nuevo párrafo.
3.  **¿Qué atributo especifica un enlace?**
    *   [ ] **A)** src
    *   [x] **B) href**
    *   [ ] **C)** link
    *   *Justificación*: El atributo `href` (Hypertext Reference) indica la URL de destino de un enlace en una etiqueta `<a>`.
4.  **¿Qué etiqueta engloba todo el documento HTML?**
    *   [ ] **A)** `<main>`
    *   [ ] **B)** `<body>`
    *   [x] **C) `<html>`**
    *   *Justificación*: Es la etiqueta raíz de todo documento estructurado HTML.
5.  **¿Qué extensión tiene un archivo HTML?**
    *   [ ] **A)** .htm
    *   [ ] **B)** .html
    *   [x] **C) Ambas**
    *   *Justificación*: Ambas extensiones son procesadas de igual forma por cualquier navegador web.
6.  **¿Etiqueta para crear lista desordenada?**
    *   [x] **A) `<ul>`**
    *   [ ] **B)** `<ol>`
    *   [ ] **C)** `<li>`
    *   *Justificación*: `<ul>` (Unordered List) define listas con viñetas; `<ol>` define listas numeradas.
7.  **¿Propósito de "alt" en etiqueta `<img>`?**
    *   [x] **A) Describir la imagen para accesibilidad**
    *   [ ] **B)** Definir el tamaño de la imagen
    *   [ ] **C)** Enlazar a otra página
    *   *Justificación*: Muestra un texto alternativo si la imagen no carga y asiste a lectores de pantalla.
8.  **¿Etiqueta HTML5 para contenido autónomo?**
    *   [x] **A) `<article>`**
    *   [ ] **B)** `<section>`
    *   [ ] **C)** `<div>`
    *   *Justificación*: Representa un bloque de contenido independiente y reutilizable (ej: un post o noticia).
9.  **¿Cuál es un elemento en línea (inline)?**
    *   [x] **A) `<span>`**
    *   [ ] **B)** `<div>`
    *   [ ] **C)** `<p>`
    *   *Justificación*: `<span>` no provoca un salto de línea automático en el flujo del documento.
10. **¿Etiqueta para el título en la pestaña?**
    *   [x] **A) `<title>`**
    *   [ ] **B)** `<header>`
    *   [ ] **C)** `<h1>`
    *   *Justificación*: Define el título de la página que se muestra en la pestaña del navegador.
11. **¿Etiqueta para insertar JavaScript?**
    *   [ ] **A)** `<javascript>`
    *   [x] **B) `<script>`**
    *   [ ] **C)** `<code>`
    *   *Justificación*: Permite insertar scripts de lógica directamente o enlazar archivos externos `.js`.
12. **¿Valor por defecto de "target" en `<a>`?**
    *   [ ] **A)** `_blank`
    *   [x] **B) `_self`**
    *   [ ] **C)** `_parent`
    *   *Justificación*: Abre el enlace por defecto en la misma pestaña o marco de navegación actual.
13. **¿Etiqueta HTML5 para encabezados?**
    *   [ ] **A)** `<head>`
    *   [x] **B) `<header>`**
    *   [ ] **C)** `<heading>`
    *   *Justificación*: Contenedor semántico diseñado para logotipos, menús o introducciones.
14. **¿Atributo para campo obligatorio?**
    *   [x] **A) required**
    *   [ ] **B)** validate
    *   [ ] **C)** mandatory
    *   *Justificación*: Atributo HTML5 que impide el envío del formulario si el campo está vacío.
15. **¿Etiqueta para reproducir audio?**
    *   [ ] **A)** `<sound>`
    *   [x] **B) `<audio>`**
    *   [ ] **C)** `<media>`
    *   *Justificación*: Permite la reproducción nativa de sonidos sin plugins externos.
16. **¿Etiqueta HTML5 para barra lateral?**
    *   [x] **A) `<aside>`**
    *   [ ] **B)** `<sidebar>`
    *   [ ] **C)** `<section>`
    *   *Justificación*: Define contenido que se relaciona de forma indirecta con el principal (barra lateral).
17. **¿Qué hace `<meta charset="UTF-8">`?**
    *   [ ] **A)** Especificar el idioma de la página
    *   [x] **B) Especificar la codificación de caracteres**
    *   [ ] **C)** Mejorar el posicionamiento SEO
    *   *Justificación*: Permite representar correctamente caracteres especiales, eñes y acentos.
18. **¿Etiqueta HTML5 para agrupar imagen y pie?**
    *   [x] **A) `<figure>`**
    *   [ ] **B)** `<image-group>`
    *   [ ] **C)** `<picture>`
    *   *Justificación*: Agrupa una imagen junto con su leyenda descriptiva (`<figcaption>`).
19. **¿Atributo para carga diferida (lazy)?**
    *   [x] **A) loading="lazy"**
    *   [ ] **B)** lazy="true"
    *   [ ] **C)** defer="image"
    *   *Justificación*: Retrasa la descarga de la imagen hasta que el usuario hace scroll cerca de ella.
20. **¿Etiqueta para resaltar texto?**
    *   [ ] **A)** `<highlight>`
    *   [x] **B) `<mark>`**
    *   [ ] **C)** `<strong>`
    *   *Justificación*: Aplica un estilo resaltado visual (típicamente fondo amarillo) al texto encerrado.

---

### 🎨 CSS (Hojas de Estilo en Cascada)

1.  **¿Qué significa CSS?**
    *   [x] **A) Cascading Style Sheets**
    *   [ ] **B)** Creative Style System
    *   [ ] **C)** Computer Style Syntax
    *   *Justificación*: Es el lenguaje estándar de estilos para dar formato a documentos HTML.
2.  **¿Cómo se selecciona una clase?**
    *   [ ] **A)** #clase
    *   [x] **B) .clase**
    *   [ ] **C)** clase
    *   *Justificación*: Los selectores de clases inician con un punto (`.`) en CSS.
3.  **¿Propiedad para color de fondo?**
    *   [x] **A) background-color**
    *   [ ] **B)** color
    *   [ ] **C)** bgcolor
    *   *Justificación*: Define el color de fondo de un contenedor. La propiedad `color` es solo para texto.
4.  **¿Qué unidad es relativa a la fuente?**
    *   [ ] **A)** px
    *   [x] **B) em**
    *   [ ] **C)** %
    *   *Justificación*: La unidad `em` escala proporcionalmente al tamaño de fuente heredado del padre.
5.  **¿Cómo se comenta en CSS?**
    *   [x] **A) `/* comentario */`**
    *   [ ] **B)** `// comentario`
    *   [ ] **C)** `<!-- comentario -->`
    *   *Justificación*: En CSS los comentarios de una o múltiples líneas solo se escriben con `/*` y `*/`.
6.  **¿Propiedad para espaciado interno?**
    *   [x] **A) padding**
    *   [ ] **B)** margin
    *   [ ] **C)** border-spacing
    *   *Justificación*: `padding` controla el margen interno del elemento; `margin` maneja el exterior.
7.  **¿Selector para elemento con ID "header"?**
    *   [x] **A) #header**
    *   [ ] **B)** .header
    *   [ ] **C)** header
    *   *Justificación*: Los IDs se seleccionan anteponiendo el símbolo numeral o almohadilla (`#`).
8.  **¿Propiedad para cambiar tipografía?**
    *   [x] **A) font-family**
    *   [ ] **B)** font-style
    *   [ ] **C)** font-type
    *   *Justificación*: Permite especificar una familia tipográfica de prioridad descendente.
9.  **¿Position para fijar a la ventana?**
    *   [x] **A) fixed**
    *   [ ] **B)** absolute
    *   [ ] **C)** sticky
    *   *Justificación*: `position: fixed` saca al elemento del flujo y lo fija relativo al viewport.
10. **¿Cómo quitar subrayado a enlaces?**
    *   [x] **A) text-decoration: none;**
    *   [ ] **B)** text-style: no-underline;
    *   [ ] **C)** link-style: none;
    *   *Justificación*: Quita el decorado predeterminado de línea inferior que traen las etiquetas `<a>`.
11. **¿Propiedad para contenido desbordado?**
    *   [x] **A) overflow**
    *   [ ] **B)** clip
    *   [ ] **C)** display
    *   *Justificación*: Controla el renderizado del contenido que supera las dimensiones físicas de la caja.
12. **¿Diferencia: display:none y visibility:hidden?**
    *   [x] **A) display: none elimina el espacio del elemento; visibility: hidden lo conserva**
    *   [ ] **B)** visibility: hidden elimina el espacio; display: none lo conserva
    *   [ ] **C)** No hay diferencias
    *   *Justificación*: `display: none` remueve la presencia física del layout; `visibility: hidden` solo lo oculta visualmente.
13. **¿Selector para elementos hijos pares?**
    *   [x] **A) :nth-child(even)**
    *   [ ] **B)** :nth-child(odd)
    *   [ ] **C)** :nth-child(2)
    *   *Justificación*: La pseudoclase filtra elementos de acuerdo a su orden, donde `even` selecciona pares.
14. **¿Propiedad para orden tridimensional (eje Z)?**
    *   [x] **A) z-index**
    *   [ ] **B)** layer-index
    *   [ ] **C)** 3d-position
    *   *Justificación*: Controla la superposición de elementos con posiciones configuradas en el eje Z.
15. **¿Propiedad para sombras en contenedor?**
    *   [ ] **A)** text-shadow
    *   [x] **B) box-shadow**
    *   [ ] **C)** shadow-color
    *   *Justificación*: Permite aplicar efectos de sombras alrededor de todo el borde exterior de la caja.
16. **¿Cómo se declara una variable CSS?**
    *   [ ] **A)** var-mi-variable: valor;
    *   [x] **B) --mi-variable: valor;**
    *   [ ] **C)** $mi-variable: valor;
    *   *Justificación*: Las variables nativas (Custom Properties) se declaran con un prefijo de doble guion.
17. **¿Flexbox: alinear en eje secundario?**
    *   [ ] **A)** justify-content
    *   [x] **B) align-items**
    *   [ ] **C)** flex-direction
    *   *Justificación*: `align-items` maneja la alineación vertical/eje secundario; `justify-content` controla el eje principal.
18. **¿Propiedad para fondo fijo/móvil?**
    *   [x] **A) background-attachment**
    *   [ ] **B)** background-scroll
    *   [ ] **C)** background-fixed
    *   *Justificación*: `background-attachment: fixed` fija la imagen de fondo de modo que no se mueva al hacer scroll.
19. **¿Valor por defecto de "position"?**
    *   [ ] **A)** relative
    *   [x] **B) static**
    *   [ ] **C)** absolute
    *   *Justificación*: `static` es la posición por defecto, siguiendo el flujo lineal secuencial del documento HTML.
20. **¿Cómo aplicar desenfoque (blur)?**
    *   [x] **A) filter: blur(5px);**
    *   [ ] **B)** backdrop-filter: blur(5px);
    *   [ ] **C)** image-effect: blur(5px);
    *   *Justificación*: Aplica filtros y distorsiones gráficas (como desenfoque gaussiano) a un elemento.

---

### 💛 JAVASCRIPT (Programación Dinámica)

1.  **¿Qué tipo de lenguaje es JavaScript?**
    *   [ ] **A)** Compilado
    *   [x] **B) Interpretado**
    *   [ ] **C)** Ambos
    *   *Justificación*: Es interpretado en tiempo de ejecución por el motor del navegador (ej: V8 en Chrome).
2.  **¿Cómo declarar variable en JavaScript?**
    *   [x] **A) var x;**
    *   [ ] **B)** int x;
    *   [ ] **C)** let x = 0;
    *   *Justificación*: Tradicionalmente se usaba `var`. Hoy se prefiere `let` o `const` para limitar el ámbito (scope).
3.  **¿Método para mostrar alerta en pantalla?**
    *   [x] **A) alert()**
    *   [ ] **B)** print()
    *   [ ] **C)** show()
    *   *Justificación*: El método `alert()` lanza un diálogo modal del navegador que interrumpe la navegación.
4.  **¿Cuál NO es un tipo de dato en JS?**
    *   [ ] **A)** string
    *   [x] **B) float**
    *   [ ] **C)** boolean
    *   *Justificación*: En JavaScript no existe el tipo `float`. Todos los números se unifican bajo el tipo `number`.
5.  **¿Comentario de una línea en JS?**
    *   [x] **A) // comentario**
    *   [ ] **B)** `/* comentario */`
    *   [ ] **C)** `<!-- comentario -->`
    *   *Justificación*: El doble slash (`//`) denota comentarios de una sola línea en JS.
6.  **¿Método para convertir texto a entero?**
    *   [x] **A) parseInt()**
    *   [ ] **B)** toString()
    *   [ ] **C)** parseNumber()
    *   *Justificación*: `parseInt()` analiza una cadena de texto y extrae el primer entero que coincida.
7.  **¿Operador de igualdad estricta?**
    *   [x] **A) ===**
    *   [ ] **B)** ==
    *   [ ] **C)** =
    *   *Justificación*: El operador `===` evalúa que tanto el tipo de dato como el valor sean idénticos.
8.  **¿Cómo agregar elemento al final de array?**
    *   [x] **A) array.push()**
    *   [ ] **B)** array.pop()
    *   [ ] **C)** array.add()
    *   *Justificación*: `push()` añade uno o más elementos al final del arreglo y retorna su nueva longitud.
9.  **¿Palabra clave para constantes?**
    *   [x] **A) const**
    *   [ ] **B)** let
    *   [ ] **C)** var
    *   *Justificación*: `const` declara variables de bloque inmutables en su reasignación directa de referencia.
10. **¿Evento disparado al hacer clic?**
    *   [x] **A) onclick**
    *   [ ] **B)** onhover
    *   [ ] **C)** onsubmit
    *   *Justificación*: Representa el disparador de eventos cuando el puntero del ratón presiona y suelta un elemento.
11. **¿Diferencia entre == y ===?**
    *   [x] **A) == convierte tipos; === compara valor y tipo sin convertir**
    *   [ ] **B)** == es asignación; === es comparación
    *   [ ] **C)** No hay diferencias
    *   *Justificación*: `==` realiza coerción (conversión implícita de tipos); `===` realiza una comparación exacta.
12. **¿Qué es un "closure" en JS?**
    *   [x] **A) Función que recuerda variables de su ámbito externo**
    *   [ ] **B)** Función que se ejecuta de inmediato
    *   [ ] **C)** Ámbito exclusivo global
    *   *Justificación*: Un closure es la combinación de una función y el entorno léxico donde se creó.
13. **¿Resultado de typeof null?**
    *   [x] **A) "object"**
    *   [ ] **B)** "null"
    *   [ ] **C)** "undefined"
    *   *Justificación*: Retorna `"object"` por un error de diseño histórico en la primera versión de JavaScript.
14. **¿Método para mapear y transformar array?**
    *   [x] **A) map()**
    *   [ ] **B)** forEach()
    *   [ ] **C)** filter()
    *   *Justificación*: `map()` devuelve un nuevo array transformado sin alterar el array de origen.
15. **¿Qué significa que JS es monohilo?**
    *   [x] **A) Ejecuta una sola tarea a la vez en un solo hilo**
    *   [ ] **B)** Tiene múltiples hilos paralelos
    *   [ ] **C)** Funciona en un solo procesador
    *   *Justificación*: JavaScript trabaja sobre un único hilo de ejecución mediante la pila de llamadas (Call Stack).
16. **¿Capturar error asíncrono con try...catch?**
    *   [x] **A) Usar await y estar dentro del bloque try**
    *   [ ] **B)** Usando .then().catch()
    *   [ ] **C)** Poner try en el callback
    *   *Justificación*: Con `async/await`, el código asíncrono se escribe de forma lineal y los errores se atrapan con `try...catch`.
17. **¿Qué hace el método reduce?**
    *   [x] **A) Aplica una función acumuladora para obtener un único valor**
    *   [ ] **B)** Elimina elementos duplicados
    *   [ ] **C)** Reduce el tamaño del array
    *   *Justificación*: Aplica una función acumuladora a todos los elementos para retornar un valor consolidado.
18. **¿Qué es una Promesa "pending"?**
    *   [x] **A) Operación asíncrona no completada ni rechazada aún**
    *   [ ] **B)** Promesa resuelta con éxito
    *   [ ] **C)** Promesa con error de red
    *   *Justificación*: Es el estado inicial de una promesa antes de ser resuelta (`fulfilled`) o rechazada (`rejected`).
19. **¿Método para unir arrays?**
    *   [x] **A) concat()**
    *   [ ] **B)** join()
    *   [ ] **C)** merge()
    *   *Justificación*: `concat()` une dos o más arreglos devolviendo uno nuevo sin mutar los originales.
20. **¿Clases: palabra para heredar de otra?**
    *   [x] **A) extends**
    *   [ ] **B)** inherits
    *   [ ] **C)** implements
    *   *Justificación*: La palabra reservada `extends` se emplea para crear clases derivadas de otras clases en ES6.

---

### 🌐 REDES DE COMPUTADORAS (Protocolos y Comunicaciones)

1.  **¿Qué es una dirección IP?**
    *   [x] **A) Identificador lógico de red**
    *   [ ] **B)** Protocolo de enrutamiento
    *   [ ] **C)** Hardware de conexión
    *   *Justificación*: Es la etiqueta numérica asignada lógicamente a cada dispositivo conectado a una red IP.
2.  **¿Qué puerto por defecto usa HTTP?**
    *   [ ] **A)** 21
    *   [x] **B) 80**
    *   [ ] **C)** 443
    *   *Justificación*: HTTP (tráfico web sin encriptar) corre de forma estándar en el puerto TCP 80.
3.  **¿Qué significa LAN?**
    *   [ ] **A)** Large Area Network
    *   [x] **B) Local Area Network**
    *   [ ] **C)** Light Area Network
    *   *Justificación*: Red de comunicación de corta distancia geográfica (Red de Área Local).
4.  **¿Qué dispositivo conecta redes distintas?**
    *   [ ] **A)** Switch
    *   [x] **B) Router**
    *   [ ] **C)** Hub
    *   *Justificación*: El enrutador (Router) trabaja en la capa 3 de OSI uniendo distintas subredes.
5.  **¿Qué protocolo asigna IPs automáticamente?**
    *   [ ] **A)** DNS
    *   [x] **B) DHCP**
    *   [ ] **C)** FTP
    *   *Justificación*: DHCP (Dynamic Host Configuration Protocol) asigna direcciones IP dinámicas y dinámicamente configurables.
6.  **¿Protocolo seguro para páginas web?**
    *   [x] **A) HTTPS**
    *   [ ] **B)** HTTP
    *   [ ] **C)** FTP
    *   *Justificación*: HTTPS añade cifrado SSL/TLS a la comunicación web ordinaria.
7.  **¿Qué significa DNS?**
    *   [x] **A) Domain Name System**
    *   [ ] **B)** Digital Network Service
    *   [ ] **C)** Dynamic Name Server
    *   *Justificación*: Sistema jerárquico que traduce nombres de dominio (google.com) a direcciones IP.
8.  **¿Máscara por defecto de Clase C?**
    *   [x] **A) 255.255.255.0**
    *   [ ] **B)** 255.255.0.0
    *   [ ] **C)** 255.0.0.0
    *   *Justificación*: Asigna 24 bits para red y 8 bits para hosts (/24).
9.  **¿Qué capa OSI enruta paquetes?**
    *   [x] **A) Capa de Red**
    *   [ ] **B)** Capa Física
    *   [ ] **C)** Capa de Transporte
    *   *Justificación*: La Capa de Red (Capa 3) del modelo de referencia OSI maneja el direccionamiento lógico y enrutamiento.
10. **¿Puerto estándar de SMTP seguro?**
    *   [x] **A) 465**
    *   [ ] **B)** 80
    *   [ ] **C)** 22
    *   *Justificación*: El puerto 465 está reservado para enviar correo electrónico de forma segura con cifrado SSL.
11. **¿Propósito del protocolo ARP?**
    *   [x] **A) Traducir direcciones IP a direcciones físicas MAC**
    *   [ ] **B)** Asignar IPs fijas
    *   [ ] **C)** Garantizar envío fiable
    *   *Justificación*: ARP (Address Resolution Protocol) mapea direcciones lógicas IP a la dirección física MAC de la placa.
12. **¿Capa TCP/IP donde opera HTTP?**
    *   [x] **A) Capa de Aplicación**
    *   [ ] **B)** Capa de Internet
    *   [ ] **C)** Capa de Acceso a Red
    *   *Justificación*: HTTP, FTP y DNS se ejecutan en el nivel superior (Aplicación) de TCP/IP.
13. **¿Rango IP privado de Clase C?**
    *   [x] **A) 192.168.0.0 a 192.168.255.255**
    *   [ ] **B)** 10.0.0.0 a 10.255.255.255
    *   [ ] **C)** 172.16.0.0 a 172.31.255.255
    *   *Justificación*: Es el rango privado reservado de Clase C para enrutamientos domésticos e internos.
14. **¿Protocolo de transporte con conexión?**
    *   [ ] **A)** UDP
    *   [x] **B) TCP**
    *   [ ] **C)** IP
    *   *Justificación*: TCP requiere el acuerdo de tres vías ('three-way handshake') garantizando entrega de paquetes ordenada.
15. **¿Qué hace NAT en un router?**
    *   [x] **A) Traduce direcciones IP privadas a una pública para compartir internet**
    *   [ ] **B)** Controla flujo de paquetes
    *   [ ] **C)** Cifra datos en tránsito
    *   *Justificación*: Mapea múltiples IPs privadas locales a una única IP pública corporativa/del ISP.
16. **¿Puerto por defecto de SSH/SFTP?**
    *   [x] **A) 22**
    *   [ ] **B)** 21
    *   [ ] **C)** 80
    *   *Justificación*: El protocolo de shell seguro (SSH) y transferencia SFTP operan sobre el puerto TCP 22.
17. **¿Función principal de un Proxy?**
    *   [x] **A) Actuar como intermediario entre un cliente y el servidor**
    *   [ ] **B)** Asignar IPs en una red
    *   [ ] **C)** Acelerar la CPU de los routers
    *   *Justificación*: Recibe las peticiones de los clientes, las filtra o almacena en caché y las reenvía al destino real.
18. **¿Qué representa la dirección ::1?**
    *   [x] **A) La dirección de loopback local en IPv6**
    *   [ ] **B)** Dirección IP pública reservada
    *   [ ] **C)** Equivalente a 255.255.255.255
    *   *Justificación*: Es la dirección de autoretorno o localhost dentro del estándar de direccionamiento IPv6.
19. **¿Protocolo para evitar bucles en switches?**
    *   [x] **A) STP (Spanning Tree Protocol)**
    *   [ ] **B)** RIP (Routing Information Protocol)
    *   [ ] **C)** OSPF
    *   *Justificación*: STP deshabilita lógicamente los enlaces redundantes para evitar tormentas de broadcast en capa 2.
20. **¿Propósito principal del protocolo ICMP?**
    *   [x] **A) Enviar mensajes de control y reporte de errores (como ping)**
    *   [ ] **B)** Transferir archivos
    *   [ ] **C)** Configurar switches
    *   *Justificación*: Utilizado por herramientas de diagnóstico de red para evaluar conectividad y latencias.

---

### 💻 SISTEMAS OPERATIVOS (Arquitectura y Administración)

1.  **¿Qué es un sistema operativo?**
    *   [ ] **A)** Programa de aplicación
    *   [x] **B) Software que administra hardware y recursos**
    *   [ ] **C)** Hardware del procesador
    *   *Justificación*: Administra los recursos del sistema de cómputo y ofrece una capa de abstracción para el software.
2.  **¿Cuál NO es un sistema operativo?**
    *   [ ] **A)** Linux
    *   [ ] **B)** Windows
    *   [x] **C) HTML**
    *   *Justificación*: HTML es un lenguaje de marcado de texto usado en la construcción de páginas web.
3.  **¿Comando Linux para listar archivos?**
    *   [x] **A) ls**
    *   [ ] **B)** cd
    *   [ ] **C)** pwd
    *   *Justificación*: El comando `ls` (list) muestra directorios y archivos dentro del directorio de trabajo actual.
4.  **¿Qué es un proceso en el SO?**
    *   [x] **A) Un programa en estado de ejecución activa**
    *   [ ] **B)** Un archivo estático en disco
    *   [ ] **C)** Usuario de red
    *   *Justificación*: Es la abstracción de un programa de computadora activo que el SO carga en memoria RAM.
5.  **¿SO de código abierto?**
    *   [ ] **A)** Windows
    *   [x] **B) Linux**
    *   [ ] **C)** macOS
    *   *Justificación*: El núcleo de Linux y gran parte de su software auxiliar se publican bajo licencias de código libre.
6.  **¿Comando Linux para cambiar permisos?**
    *   [x] **A) chmod**
    *   [ ] **B)** chown
    *   [ ] **C)** chperm
    *   *Justificación*: `chmod` (change mode) define los permisos de lectura, escritura y ejecución de los archivos.
7.  **¿Sistema de archivos estándar Windows?**
    *   [x] **A) NTFS**
    *   [ ] **B)** ext4
    *   [ ] **C)** FAT32
    *   *Justificación*: NTFS es el formato nativo preferente para la familia NT de Windows (Windows XP en adelante).
8.  **¿Qué es la memoria virtual (swap)?**
    *   [x] **A) Espacio en disco utilizado para extender la memoria RAM**
    *   [ ] **B)** Chip de memoria ultra rápida
    *   [ ] **C)** Memoria volátil en la nube
    *   *Justificación*: El sistema operativo usa el disco como almacenamiento secundario si se agota la memoria física (RAM).
9.  **¿Comando Linux para ruta actual?**
    *   [x] **A) pwd**
    *   [ ] **B)** cd
    *   [ ] **C)** whereami
    *   *Justificación*: `pwd` (print working directory) imprime en consola la ruta absoluta del directorio actual.
10. **¿Estructura para cola de procesos?**
    *   [x] **A) Cola de procesos**
    *   [ ] **B)** Pila de llamadas
    *   [ ] **C)** Árbol de directorios
    *   *Justificación*: Estructura tipo cola (FIFO) donde aguardan los procesos listos para recibir tiempo de procesamiento.
11. **¿Qué es un Deadlock (interbloqueo)?**
    *   [x] **A) Procesos bloqueados esperando recursos mutuamente de forma indefinida**
    *   [ ] **B)** Fallo del disco duro principal
    *   [ ] **C)** Virus de memoria RAM
    *   *Justificación*: Sucede cuando dos o más procesos están estancados en un ciclo infinito de espera de recursos bloqueados.
12. **¿Comando Linux para buscar texto?**
    *   [x] **A) grep**
    *   [ ] **B)** find
    *   [ ] **C)** search
    *   *Justificación*: El comando `grep` analiza flujos o archivos buscando coincidencia con un patrón de texto regular.
13. **¿Qué hace la tabla de páginas?**
    *   [x] **A) Mapear direcciones virtuales de procesos a direcciones físicas RAM**
    *   [ ] **B)** Hacer un índice de archivos
    *   [ ] **C)** Listar usuarios autorizados
    *   *Justificación*: Traduce las direcciones de la memoria virtual direccionadas por el proceso en direcciones físicas reales en la RAM.
14. **¿Comando Linux para ver procesos en vivo?**
    *   [x] **A) top**
    *   [ ] **B)** ps
    *   [ ] **C)** process-list
    *   *Justificación*: Muestra de forma en vivo, dinámica e interactiva los hilos y consumos del procesador en tiempo real.
15. **¿Qué componente planifica la CPU?**
    *   [x] **A) Planificador o Scheduler**
    *   [ ] **B)** Gestor de memoria
    *   [ ] **C)** BIOS
    *   *Justificación*: Decide qué proceso listo tomará control de la CPU, implementando políticas como Round Robin o prioridad.
16. **¿Qué es una llamada al sistema (syscall)?**
    *   [x] **A) Interfaz para solicitar servicios del núcleo del SO**
    *   [ ] **B)** Alerta telefónica de error
    *   [ ] **C)** Interrupción externa de teclado
    *   *Justificación*: Interfaz que permite que programas en modo usuario ejecuten acciones en modo kernel (disco, red, etc.).
17. **¿Sistema de archivos nativo de Linux?**
    *   [x] **A) ext4**
    *   [ ] **B)** NTFS
    *   [ ] **C)** APFS
    *   *Justificación*: `ext4` es el sistema de archivos transaccional nativo de la mayoría de distribuciones modernas.
18. **¿PowerShell: listar servicios?**
    *   [x] **A) Get-Service**
    *   [ ] **B)** services.msc
    *   [ ] **C)** list-services
    *   *Justificación*: El cmdlet `Get-Service` extrae la lista oficial de servicios del sistema operativo en Windows.
19. **¿Comando Linux para cambiar dueño?**
    *   [x] **A) chown**
    *   [ ] **B)** chmod
    *   [ ] **C)** owner
    *   *Justificación*: `chown` (change owner) modifica el propietario asignado y el grupo asignado de un archivo o carpeta.
20. **¿Qué es la fragmentación externa?**
    *   [x] **A) Memoria total libre suficiente pero no contigua para usarse**
    *   [ ] **B)** Desgaste del hardware de la RAM
    *   [ ] **C)** Datos corruptos por fallos de luz
    *   *Justificación*: Espacio libre de memoria partido en múltiples fragmentos no adyacentes imposibles de usar por procesos grandes.
