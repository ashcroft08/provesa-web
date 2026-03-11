import { db } from '$lib/server/db';
import { legalPages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const legalRepository = {
    /** Obtiene todas las páginas legales */
    async getAll() {
        return await db.select().from(legalPages);
    },

    /** Obtiene una página legal por slug */
    async getBySlug(slug) {
        const [page] = await db.select().from(legalPages).where(eq(legalPages.slug, slug));
        return page || null;
    },

    /** Crea o actualiza una página legal por slug */
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
