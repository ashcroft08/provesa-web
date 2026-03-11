import { db } from '$lib/server/db';
import { nosotrosConfig, nosotrosPage } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const nosotrosRepository = {
    /** Obtiene la configuración del teaser Nosotros (singleton) */
    async getConfig() {
        const [config] = await db.select().from(nosotrosConfig).limit(1);
        return config || null;
    },

    /** Crea o actualiza la configuración del teaser */
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

    /** Obtiene el contenido de la página /nosotros (singleton) */
    async getPage() {
        const [page] = await db.select().from(nosotrosPage).limit(1);
        return page || null;
    },

    /** Crea o actualiza el contenido de la página /nosotros */
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
