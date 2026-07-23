const nodemailer = require('nodemailer');

// Obtener transporter de Nodemailer configurado desde variables de entorno
function getTransporter() {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: process.env.SMTP_USER ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        } : undefined
    });
}

/**
 * Plantilla HTML con estilos responsive y modernos para CertiWebs
 */
function generarLayoutHTML({ titulo, subtitulo, contenido, ticketId, fecha }) {
    return `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${titulo}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0f172a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #f8fafc;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color: #0f172a; padding: 30px 10px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width: 600px; background-color: #1e293b; border-radius: 12px; border: 1px solid #334155; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0284c7 0%, #3b82f6 50%, #6366f1 100%); padding: 30px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 26px; font-weight: 800; letter-spacing: 0.5px;">⚡ CertiWebs</h1>
                            <p style="margin: 8px 0 0 0; color: #e0f2fe; font-size: 14px;">${subtitulo || 'Plataforma de Certificaciones de Informática'}</p>
                        </td>
                    </tr>

                    <!-- Contenido principal -->
                    <tr>
                        <td style="padding: 30px 25px;">
                            <h2 style="margin-top: 0; color: #38bdf8; font-size: 20px; border-bottom: 2px solid #334155; padding-bottom: 10px;">
                                ${titulo}
                            </h2>

                            ${ticketId ? `
                            <div style="background-color: #0f172a; border-left: 4px solid #0284c7; padding: 12px 16px; margin: 15px 0 25px 0; border-radius: 4px;">
                                <span style="font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; display: block;">Identificador de Registro</span>
                                <strong style="font-size: 16px; color: #38bdf8;">${ticketId}</strong>
                                <span style="float: right; font-size: 12px; color: #94a3b8;">${fecha || new Date().toLocaleString()}</span>
                            </div>
                            ` : ''}

                            ${contenido}

                            <!-- Bloque del sistema -->
                            <div style="margin-top: 30px; padding: 15px; background-color: #0f172a; border-radius: 8px; border: 1px solid #1e293b; font-size: 13px; color: #94a3b8;">
                                <strong style="color: #cbd5e1;">📌 Información del Sistema CertiWebs:</strong><br/>
                                • Esta notificacion fue generada de manera automática por el sistema al completar el formulario.<br/>
                                • Si tienes alguna inquietud adicional, puedes comunicarte con soporte o iniciar sesión en tu cuenta.
                            </div>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #0f172a; padding: 20px; text-align: center; border-top: 1px solid #334155; font-size: 12px; color: #64748b;">
                            <p style="margin: 0 0 6px 0;">&copy; ${new Date().getFullYear()} CertiWebs - Universidad Nacional del Litoral</p>
                            <p style="margin: 0;">Plataforma Educativa de Informática y Exámenes de Certificación</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;
}

/**
 * Enviar correo de confirmación de contacto al usuario y notificación al admin
 */
async function enviarCorreosContacto({ id, nombre, email, tipoConsulta, asunto, mensaje, fechaEnvio }) {
    const ticketId = `#CONT-${String(id).padStart(4, '0')}`;
    const fecha = fechaEnvio || new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const tipo = tipoConsulta || 'Consulta General';
    const adminEmail = process.env.CONTACT_RECIPIENT || 'octaarami@gmail.com';

    // 1. Plantilla para el USUARIO que llenó el formulario
    const htmlUsuario = generarLayoutHTML({
        titulo: '¡Hemos recibido tu mensaje correctamente!',
        subtitulo: 'Confirmación de Formulario de Contacto',
        ticketId,
        fecha,
        contenido: `
            <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                Hola <strong style="color: #ffffff;">${nombre}</strong>,
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                Gracias por ponerte en contacto con <strong>CertiWebs</strong>. Tu mensaje ha sido registrado exitosamente en nuestro sistema con los datos detallados a continuación:
            </p>

            <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="background-color: #0f172a; border-radius: 8px; margin: 20px 0; font-size: 14px; border: 1px solid #334155;">
                <tr>
                    <td width="35%" style="color: #94a3b8; font-weight: 600;">Nombre Completo:</td>
                    <td style="color: #ffffff;">${nombre}</td>
                </tr>
                <tr>
                    <td style="color: #94a3b8; font-weight: 600;">Correo Registrado:</td>
                    <td style="color: #38bdf8;">${email}</td>
                </tr>
                <tr>
                    <td style="color: #94a3b8; font-weight: 600;">Tipo de Consulta:</td>
                    <td style="color: #fbbf24;">${tipo}</td>
                </tr>
                <tr>
                    <td style="color: #94a3b8; font-weight: 600;">Asunto:</td>
                    <td style="color: #ffffff;">${asunto}</td>
                </tr>
                <tr>
                    <td style="color: #94a3b8; font-weight: 600; vertical-align: top;">Mensaje Enviado:</td>
                    <td style="color: #e2e8f0; background-color: #1e293b; border-radius: 4px; padding: 10px; font-family: monospace; white-space: pre-wrap;">${mensaje}</td>
                </tr>
            </table>

            <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1;">
                Nuestro equipo técnico revisará tu solicitud y te responderá directamente a este correo de Gmail en breve.
            </p>
        `
    });

    const textUsuario = `¡Hola ${nombre}!\n\nHemos recibido tu mensaje de contacto en CertiWebs.\n\nTicket: ${ticketId}\nFecha: ${fecha}\nTipo: ${tipo}\nAsunto: ${asunto}\nMensaje:\n${mensaje}\n\nTe responderemos a la brevedad.\nAtentamente,\nEl Equipo de CertiWebs`;

    // 2. Plantilla para el ADMINISTRADOR
    const htmlAdmin = generarLayoutHTML({
        titulo: '🔔 Nuevo Mensaje de Contacto Recibido',
        subtitulo: 'Notificación del Sistema para Administrador',
        ticketId,
        fecha,
        contenido: `
            <p style="font-size: 15px; color: #e2e8f0;">
                Se ha recibido una nueva consulta en el sitio web con los siguientes datos:
            </p>
            <table role="presentation" width="100%" cellspacing="0" cellpadding="8" style="background-color: #0f172a; border-radius: 8px; margin: 20px 0; font-size: 14px; border: 1px solid #334155;">
                <tr><td width="35%" style="color: #94a3b8;">Remitente:</td><td style="color: #ffffff; font-weight: bold;">${nombre} (${email})</td></tr>
                <tr><td style="color: #94a3b8;">Tipo:</td><td style="color: #fbbf24;">${tipo}</td></tr>
                <tr><td style="color: #94a3b8;">Asunto:</td><td style="color: #ffffff;">${asunto}</td></tr>
                <tr><td style="color: #94a3b8; vertical-align: top;">Mensaje:</td><td style="color: #e2e8f0; background-color: #1e293b; border-radius: 4px; padding: 10px; font-family: monospace;">${mensaje}</td></tr>
            </table>
        `
    });

    const textAdmin = `[CertiWebs Admin] Nuevo mensaje de contacto ${ticketId}\nDe: ${nombre} <${email}>\nTipo: ${tipo}\nAsunto: ${asunto}\nMensaje:\n${mensaje}`;

    let transporter;
    let isTest = false;
    let envios = { usuario: false, admin: false, error: null };
    const fromAddress = process.env.SMTP_FROM || `"CertiWebs" <${process.env.SMTP_USER || 'no-reply@certiwebs.com'}>`;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'tu_password_app_aqui') {
        console.warn('\n⚠️ [ATENCIÓN SMTP] Usando cuenta de pruebas temporal (Ethereal Email) porque SMTP_PASS no está configurado en .env.');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            isTest = true;
        } catch (e) {
            console.error('❌ Error al crear cuenta SMTP de pruebas:', e.message);
            return { envios, error: 'No se pudo configurar el correo de pruebas' };
        }
    } else {
        transporter = getTransporter();
    }

    try {
        // Enviar correo al USUARIO que completó el formulario
        const infoUser = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `CertiWebs - Confirmación de Consulta ${ticketId}`,
            text: textUsuario,
            html: htmlUsuario
        });
        envios.usuario = true;

        if (isTest) {
            console.log(`✉️ [Prueba] URL para ver correo del usuario (${email}): ${nodemailer.getTestMessageUrl(infoUser)}`);
        } else {
            console.log(`✅ [Gmail] Correo de confirmación enviado exitosamente al usuario: ${email}`);
        }

        // Enviar notificación al ADMINISTRADOR
        const infoAdmin = await transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            subject: `[CertiWebs Admin] ${ticketId}: ${asunto}`,
            text: textAdmin,
            html: htmlAdmin
        });
        envios.admin = true;

        if (isTest) {
            console.log(`✉️ [Prueba] URL para ver correo del admin (${adminEmail}): ${nodemailer.getTestMessageUrl(infoAdmin)}`);
        } else {
            console.log(`✅ [Gmail] Notificación enviada al administrador: ${adminEmail}`);
        }

    } catch (err) {
        console.error('❌ [Gmail Error] No se pudo enviar el correo via Nodemailer:', err.message);
        if (err.message.includes('Invalid login') || err.message.includes('Username and Password not accepted') || err.message.includes('535')) {
            console.error('👉 IMPORTANTE: Google requiere una "Contraseña de Aplicación" de 16 caracteres, no tu contraseña habitual de Gmail.');
            console.error('👉 Genera la contraseña en: https://myaccount.google.com/apppasswords');
        }
        envios.error = err.message;
    }

    return { envios, isTest };
}

/**
 * Enviar correo de confirmación de boletín/newsletter al usuario y notificación al admin
 */
async function enviarCorreosBoletin({ id, email, fechaSuscripcion }) {
    const ticketId = `#BOL-${String(id).padStart(4, '0')}`;
    const fecha = fechaSuscripcion || new Date().toLocaleString('es-AR', { timeZone: 'America/Argentina/Buenos_Aires' });
    const adminEmail = process.env.NEWSLETTER_RECIPIENT || process.env.CONTACT_RECIPIENT || 'octaarami@gmail.com';

    // 1. Plantilla para el SUSCRIPTOR
    const htmlSuscriptor = generarLayoutHTML({
        titulo: '¡Te has suscrito al Boletín Técnico de CertiWebs! 🚀',
        subtitulo: 'Confirmación de Suscripción Automática',
        ticketId,
        fecha,
        contenido: `
            <p style="font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                ¡Bienvenido/a! Tu correo <strong style="color: #38bdf8;">${email}</strong> ha sido registrado correctamente en nuestro boletín oficial de novedades.
            </p>
            <p style="font-size: 15px; line-height: 1.6; color: #cbd5e1;">
                A partir de este momento recibirás notificaciones periódicas sobre:
            </p>
            <ul style="color: #93c5fd; font-size: 14px; line-height: 1.8;">
                <li>📘 <strong>Nuevas Guías de Estudio:</strong> Desarrollo Web (HTML/CSS/JS), Redes Informáticas y Sistemas Operativos.</li>
                <li>🎯 <strong>Simuladores de Exámenes:</strong> Nuevas preguntas y certificaciones oficiales agregadas.</li>
                <li>💡 <strong>Actualizaciones de la Plataforma:</strong> Herramientas interactivas y material exclusivo.</li>
            </ul>
        `
    });

    const textSuscriptor = `¡Hola!\n\nTe has suscrito exitosamente al Boletín de Novedades de CertiWebs.\nID de suscripción: ${ticketId}\nFecha: ${fecha}\nEmail: ${email}\n\n¡Gracias por formar parte de CertiWebs!`;

    // 2. Plantilla para el ADMINISTRADOR
    const htmlAdmin = generarLayoutHTML({
        titulo: '📰 Nueva Suscripción al Boletín',
        subtitulo: 'Notificación del Sistema para Administrador',
        ticketId,
        fecha,
        contenido: `
            <p style="font-size: 15px; color: #e2e8f0;">
                Un nuevo usuario se ha suscrito al boletín de novedades:
            </p>
            <div style="background-color: #0f172a; padding: 15px; border-radius: 8px; border: 1px solid #334155; margin: 15px 0;">
                <strong>Email:</strong> <span style="color: #38bdf8;">${email}</span><br/>
                <strong>ID Registro:</strong> ${ticketId}<br/>
                <strong>Fecha:</strong> ${fecha}
            </div>
        `
    });

    const textAdmin = `[CertiWebs Admin] Nueva suscripción al boletín ${ticketId}\nEmail: ${email}\nFecha: ${fecha}`;

    let transporter;
    let isTest = false;
    let envios = { usuario: false, admin: false, error: null };
    const fromAddress = process.env.SMTP_FROM || `"CertiWebs" <${process.env.SMTP_USER || 'no-reply@certiwebs.com'}>`;

    if (!process.env.SMTP_USER || !process.env.SMTP_PASS || process.env.SMTP_PASS === 'tu_password_app_aqui') {
        console.warn('\n⚠️ [ATENCIÓN SMTP] Usando cuenta de pruebas temporal (Ethereal Email) porque SMTP_PASS no está configurado en .env.');
        try {
            const testAccount = await nodemailer.createTestAccount();
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                secure: false,
                auth: {
                    user: testAccount.user,
                    pass: testAccount.pass
                }
            });
            isTest = true;
        } catch (e) {
            console.error('❌ Error al crear cuenta SMTP de pruebas:', e.message);
            return { envios, error: 'No se pudo configurar el correo de pruebas' };
        }
    } else {
        transporter = getTransporter();
    }

    try {
        const infoUser = await transporter.sendMail({
            from: fromAddress,
            to: email,
            subject: `CertiWebs - Confirmación de Suscripción al Boletín ${ticketId}`,
            text: textSuscriptor,
            html: htmlSuscriptor
        });
        envios.usuario = true;

        if (isTest) {
            console.log(`✉️ [Prueba] URL para ver correo del suscriptor (${email}): ${nodemailer.getTestMessageUrl(infoUser)}`);
        } else {
            console.log(`✅ [Gmail] Correo de bienvenida al boletín enviado exitosamente a: ${email}`);
        }

        const infoAdmin = await transporter.sendMail({
            from: fromAddress,
            to: adminEmail,
            subject: `[CertiWebs Admin] Nueva suscripción al boletín - ${email}`,
            text: textAdmin,
            html: htmlAdmin
        });
        envios.admin = true;

        if (isTest) {
            console.log(`✉️ [Prueba] URL para ver correo del admin (${adminEmail}): ${nodemailer.getTestMessageUrl(infoAdmin)}`);
        } else {
            console.log(`✅ [Gmail] Notificación enviada al administrador: ${adminEmail}`);
        }
    } catch (err) {
        console.error('❌ [Gmail Error] Error al enviar correo de boletín via Nodemailer:', err.message);
        if (err.message.includes('Invalid login') || err.message.includes('Username and Password not accepted') || err.message.includes('535')) {
            console.error('👉 IMPORTANTE: Google requiere una "Contraseña de Aplicación" de 16 caracteres, no tu contraseña habitual de Gmail.');
            console.error('👉 Genera la contraseña en: https://myaccount.google.com/apppasswords');
        }
        envios.error = err.message;
    }

    return { envios, isTest };
}

module.exports = {
    enviarCorreosContacto,
    enviarCorreosBoletin
};
