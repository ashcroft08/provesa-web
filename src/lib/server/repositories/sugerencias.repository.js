import { db } from '$lib/server/db';
import { sugerencias, sugerenciasConfig } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const sugerenciasRepository = {
    /** Obtiene todas las sugerencias (más recientes primero) */
    async getAll() {
        return await db.select().from(sugerencias).orderBy(desc(sugerencias.createdAt));
    },

    /** Crea una nueva sugerencia */
    async create(data) {
        await db.insert(sugerencias).values(data);
    },

    /** Marca una sugerencia como leída */
    async markAsRead(id) {
        await db.update(sugerencias).set({ leido: true }).where(eq(sugerencias.id, id));
    },

    /** Elimina una sugerencia por ID */
    async remove(id) {
        await db.delete(sugerencias).where(eq(sugerencias.id, id));
    },

    /** Obtiene la configuración de sugerencias (singleton) */
    async getConfig() {
        const [config] = await db.select().from(sugerenciasConfig).limit(1);
        return config || null;
    },

    /** Crea o actualiza la configuración de sugerencias */
    async upsertConfig(opciones) {
        const [existing] = await db.select().from(sugerenciasConfig).limit(1);

        if (existing) {
            await db
                .update(sugerenciasConfig)
                .set({ opciones })
                .where(eq(sugerenciasConfig.id, existing.id));
        } else {
            await db.insert(sugerenciasConfig).values({ opciones });
        }
    }
};
