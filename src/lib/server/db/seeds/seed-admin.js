// Usando el cargador nativo de Node --env-file=.env
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../schema.js';

const { DATABASE_URL, BETTER_AUTH_SECRET, ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

if (!DATABASE_URL || !BETTER_AUTH_SECRET) {
    console.error('❌ Error: DATABASE_URL o BETTER_AUTH_SECRET no están definidas en el archivo .env');
    process.exit(1);
}

if (!ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error('❌ Error: ADMIN_NAME, ADMIN_EMAIL o ADMIN_PASSWORD no están definidas en el archivo .env');
    process.exit(1);
}

const client = postgres(DATABASE_URL);
const db = drizzle(client, { schema });

const auth = betterAuth({
    database: drizzleAdapter(db, { provider: 'pg' }),
    emailAndPassword: { enabled: true },
    secret: BETTER_AUTH_SECRET
});

async function seed() {
    try {
        await auth.api.signUpEmail({
            body: {
                name: ADMIN_NAME,
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD
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
