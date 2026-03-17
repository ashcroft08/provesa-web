import { db } from '$lib/server/db';
import { siteConfig } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const siteConfigRepository = {
    /** Obtiene toda la configuración como un mapa key-value */
    async getAll() {
        const rows = await db.select().from(siteConfig);
        /** @type {Record<string, string>} */
        const config = {};
        for (const row of rows) {
            config[row.key] = row.value;
        }
        return config;
    },

    /** 
     * Recupera una configuración específica por su clave única.
     * @param {string} key - Clave de la configuración (ej: 'logoUrl').
     * @returns {Promise<string|null>}
     */
    async get(key) {
        const [row] = await db.select().from(siteConfig).where(eq(siteConfig.key, key));
        return row?.value || null;
    },

    /** 
     * Inserta o actualiza un valor de configuración global.
     * @param {string} key - Clave del ajuste.
     * @param {string} value - Valor asociado.
     * @returns {Promise<void>}
     */
    async upsert(key, value) {
        const existing = await db.select().from(siteConfig).where(eq(siteConfig.key, key));

        if (existing.length > 0) {
            await db.update(siteConfig).set({ value }).where(eq(siteConfig.key, key));
        } else {
            await db.insert(siteConfig).values({ key, value });
        }
    }
};
