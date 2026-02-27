import { db } from '../src/lib/server/db/index.js';
import { sugerencias } from '../src/lib/server/db/schema.js';

async function verify() {
    try {
        const results = await db.select().from(sugerencias);
        console.log('--- SUGERENCIAS EN BD ---');
        console.log(JSON.stringify(results, null, 2));
        console.log('-------------------------');
    } catch (e) {
        console.error('Error verificando BD:', e);
    }
    process.exit(0);
}

verify();
