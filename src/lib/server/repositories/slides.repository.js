import { db } from '$lib/server/db';
import { heroSlides } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const slidesRepository = {
    /** Obtiene todos los slides ordenados */
    async getAll() {
        return await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    },

    /** 
     * Crea un nuevo slide para el carrusel de la página de inicio.
     * @param {any} data - Datos del slide (imagen, título, link).
     * @returns {Promise<void>}
     */
    async create(data) {
        await db.insert(heroSlides).values(data);
    },

    /** 
     * Actualiza un slide existente por su ID.
     * @param {number} id - ID del slide.
     * @param {any} data - Nuevos datos para el slide.
     * @returns {Promise<void>}
     */
    async update(id, data) {
        await db
            .update(heroSlides)
            .set(data)
            .where(eq(heroSlides.id, id));
    },

    /** 
     * Elimina un slide del carrusel por su ID.
     * @param {number} id - ID del slide.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await db.delete(heroSlides).where(eq(heroSlides.id, id));
    }
};
