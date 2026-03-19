import { db } from '$lib/server/db';
import { heroSlides } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const slidesRepository = {
    /** Obtiene todos los slides ordenados */
    async getAll() {
        return await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    },

    /** Crea un nuevo slide */
    async create(data) {
        await db.insert(heroSlides).values(data);
    },

    /** Actualiza un slide por ID */
    async update(id, data) {
        await db
            .update(heroSlides)
            .set(data)
            .where(eq(heroSlides.id, id));
    },

    /** Elimina un slide por ID */
    async remove(id) {
        await db.delete(heroSlides).where(eq(heroSlides.id, id));
    }
};
