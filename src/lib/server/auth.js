import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';

export const auth = betterAuth({
	baseURL: env.ORIGIN,
	secret: env.BETTER_AUTH_SECRET,
	database: drizzleAdapter(db, { provider: 'pg' }),

	// Configuración de sesión: expira en 1 hora, sin auto-refresh
	session: {
		expiresIn: 60 * 60, // 1 hora (en segundos)
		updateAge: 0, // No refrescar la sesión automáticamente
	},

	// Limitar intentos de login: máx 5 intentos cada 60 segundos por IP
	rateLimit: {
		window: 60, // ventana de tiempo en segundos
		max: 100, // máximo global de requests por ventana
		customRules: {
			'/sign-in/email': {
				window: 60, // 60 segundos
				max: 5, // máximo 5 intentos de login
			},
			'/forget-password': {
				window: 60,
				max: 3, // máximo 3 solicitudes de recuperación
			},
		},
	},

	emailAndPassword: {
		enabled: true,
		async sendResetPassword({ user, url }) {
			const nodemailer = await import('nodemailer');
			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: env.GMAIL_USER,
					pass: env.GMAIL_APP_PASSWORD
				}
			});

			await transporter.sendMail({
				from: `"PROVESA SCC" <${env.GMAIL_USER}>`,
				to: user.email,
				subject: 'Recuperación de contraseña - PROVESA',
				html: `
					<div style="font-family: sans-serif; max-width: 600px; margin: auto;">
						<h2>Hola, ${user.name}</h2>
						<p>Recibimos una solicitud para restablecer tu contraseña en el Panel Administrativo de PROVESA.</p>
						<p>Haz clic en el siguiente botón para continuar:</p>
						<a href="${url}" style="display: inline-block; padding: 12px 24px; background-color: #1565C0; color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">Restablecer Contraseña</a>
						<p style="margin-top: 20px; color: #666; font-size: 12px;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
					</div>
				`
			});
		}
	},
	plugins: [sveltekitCookies(getRequestEvent)] // make sure this is the last plugin in the array
});
