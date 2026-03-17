import { db } from '$lib/server/db';
import { sugerencias, sugerenciasConfig } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const sugerenciasRepository = {
    /** 
     * Obtiene todas las sugerencias recibidas, ordenadas de más recientes a más antiguas.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await db.select().from(sugerencias).orderBy(desc(sugerencias.createdAt));
    },

    /** 
     * Almacena una nueva sugerencia enviada por el usuario.
     * @param {any} data - Datos de la sugerencia (mensaje, etc).
     * @returns {Promise<void>}
     */
    async create(data) {
        await db.insert(sugerencias).values(data);
    },

    /** 
     * Marca una sugerencia específica como revisada/leída.
     * @param {string} id - ID de la sugerencia (UUID).
     * @returns {Promise<void>}
     */
    async markAsRead(id) {
        await db.update(sugerencias).set({ leido: true }).where(eq(sugerencias.id, id));
    },

    /** 
     * Elimina permanentemente una sugerencia por su ID.
     * @param {string} id - ID de la sugerencia (UUID).
     * @returns {Promise<void>}
     */
    async remove(id) {
        await db.delete(sugerencias).where(eq(sugerencias.id, id));
    },

    /** 
     * Recupera la configuración global del módulo de sugerencias (tipos, destinatarios, etc).
     * @returns {Promise<Object|null>}
     */
    async getConfig() {
        const [config] = await db.select().from(sugerenciasConfig).limit(1);
        return config || null;
    },

    /** 
     * Actualiza los tipos de sugerencias disponibles en el formulario.
     * @param {string[]} opciones - Arreglo con los nuevos tipos de sugerencias.
     * @returns {Promise<void>}
     */
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
