import { db } from '$lib/server/db';
import { nosotrosConfig, nosotrosPage } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const nosotrosRepository = {
    /** Obtiene la configuración del teaser Nosotros (singleton) */
    async getConfig() {
        const [config] = await db.select().from(nosotrosConfig).limit(1);
        return config || null;
    },

    /** 
     * Crea o actualiza la configuración del teaser resumido de "Nosotros".
     * @param {any} data - Objeto con título y descripción breve.
     * @returns {Promise<void>}
     */
    async upsertConfig(data) {
        const [existing] = await db.select().from(nosotrosConfig).limit(1);

        if (existing) {
            await db
                .update(nosotrosConfig)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(nosotrosConfig.id, existing.id));
        } else {
            await db.insert(nosotrosConfig).values(data);
        }
    },

    /** 
     * Obtiene el contenido completo de la página de "Nosotros" (historia, misión, visión).
     * @returns {Promise<Object|null>}
     */
    async getPage() {
        const [page] = await db.select().from(nosotrosPage).limit(1);
        return page || null;
    },

    /** 
     * Actualiza el contenido detallado de la página editorial de "Nosotros".
     * @param {any} data - Contenido estructurado de la página.
     * @returns {Promise<void>}
     */
    async upsertPage(data) {
        const [existing] = await db.select().from(nosotrosPage).limit(1);

        if (existing) {
            await db
                .update(nosotrosPage)
                .set({ ...data, updatedAt: new Date() })
                .where(eq(nosotrosPage.id, existing.id));
        } else {
            await db.insert(nosotrosPage).values(data);
        }
    }
};
