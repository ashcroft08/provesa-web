import { db } from '$lib/server/db';
import { legalPages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const legalRepository = {
    /** 
     * Obtiene el listado de todas las páginas legales (privacidad, términos, etc).
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await db.select().from(legalPages);
    },

    /** 
     * Recupera el contenido de una página legal específica mediante su slug.
     * @param {string} slug - Identificador único de la página.
     * @returns {Promise<Object|null>}
     */
    async getBySlug(slug) {
        const [page] = await db.select().from(legalPages).where(eq(legalPages.slug, slug));
        return page || null;
    },

    /** 
     * Crea una nueva página legal o actualiza el contenido de una existente.
     * @param {string} slug - Identificador de la página.
     * @param {Object} data - Título y contenido de la página.
     * @returns {Promise<void>}
     */
    async upsert(slug, data) {
        const [existing] = await db.select().from(legalPages).where(eq(legalPages.slug, slug));

        if (existing) {
            await db
                .update(legalPages)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(legalPages.id, existing.id));
        } else {
            await db.insert(legalPages).values({ slug, ...data });
        }
    }
};
