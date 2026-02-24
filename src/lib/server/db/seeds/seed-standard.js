// Usando el cargador nativo de Node --env-file=.env
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema.js';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL no está definida en el archivo .env');
    process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: { enabled: true },
    secret: process.env.BETTER_AUTH_SECRET || 'fallback_secret'
});

async function seed() {
    try {
        await auth.api.signUpEmail({
            body: {
                name: 'Administrador',
                email: 'admin@provesa.com',
                password: 'Admin_*_2026'
            }
        });
        console.log('✅ Usuario admin creado con éxito');
    } catch (error) {
        if (error.code === 'user_already_exists') {
            console.log('ℹ️ El usuario administrador ya existe.');
        } else {
            console.error('❌ Error al crear el usuario:', error);
        }
    } finally {
        await client.end();
    }
}

seed();
