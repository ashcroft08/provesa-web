import { db } from '$lib/server/db';
import { postulaciones } from '$lib/server/db/schema';
import { eq, desc } from 'drizzle-orm';

export const postulacionesRepository = {
    /** Obtiene todas las postulaciones (más recientes primero) */
    async getAll() {
        return await db.select().from(postulaciones).orderBy(desc(postulaciones.createdAt));
    },

    /** Crea una nueva postulación */
    async create(data) {
        await db.insert(postulaciones).values(data);
    },

    /** Elimina una postulación por ID */
    async remove(id) {
        await db.delete(postulaciones).where(eq(postulaciones.id, String(id)));
    }
};
