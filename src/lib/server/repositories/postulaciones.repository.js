import { db } from '$lib/server/db';
import { postulaciones } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const postulacionesRepository = {
    /** Obtiene todas las postulaciones (más recientes primero) */
    async getAll() {
        return await db.select().from(postulaciones).orderBy(desc(postulaciones.createdAt));
    },

    /** 
     * Registra una nueva aplicación de empleo enviada por un candidato.
     * @param {any} data - Datos de la postulación y enlace al CV.
     * @returns {Promise<void>}
     */
    async create(data) {
        await db.insert(postulaciones).values(data);
    },

    /** 
     * Elimina definitivamente una postulación por su ID único.
     * @param {string|number} id - ID de la postulación.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await db.delete(postulaciones).where(eq(postulaciones.id, String(id)));
    }
};
