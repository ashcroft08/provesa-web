import { db } from '$lib/server/db/index.js';
import { concursos, concursosGanadores } from '$lib/server/db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const concursosRepository = {
    // ─── Concursos ───

    async getAll() {
        return db.select().from(concursos).orderBy(asc(concursos.sortOrder));
    },

    async getActive() {
        const rows = await db.select().from(concursos).where(eq(concursos.isActive, true)).limit(1);
        return rows[0] || null;
    },

    /** @param {number} id */
    async getById(id) {
        const rows = await db.select().from(concursos).where(eq(concursos.id, id)).limit(1);
        return rows[0] || null;
    },

    /** @param {typeof concursos.$inferInsert} data */
    async create(data) {
        const rows = await db.insert(concursos).values(data).returning();
        return rows[0];
    },

    /**
     * @param {number} id
     * @param {Partial<typeof concursos.$inferInsert>} data
     */
    async update(id, data) {
        return db.update(concursos).set(data).where(eq(concursos.id, id));
    },

    /** @param {number} id */
    async remove(id) {
        return db.delete(concursos).where(eq(concursos.id, id));
    },

    // ─── Ganadores ───

    async getAllGanadores() {
        return db.select().from(concursosGanadores).orderBy(asc(concursosGanadores.sortOrder));
    },

    /** @param {number} concursoId */
    async getGanadoresByConcurso(concursoId) {
        return db.select().from(concursosGanadores)
            .where(eq(concursosGanadores.concursoId, concursoId))
            .orderBy(asc(concursosGanadores.sortOrder));
    },

    /** @param {typeof concursosGanadores.$inferInsert} data */
    async createGanador(data) {
        const rows = await db.insert(concursosGanadores).values(data).returning();
        return rows[0];
    },

    /**
     * @param {number} id
     * @param {Partial<typeof concursosGanadores.$inferInsert>} data
     */
    async updateGanador(id, data) {
        return db.update(concursosGanadores).set(data).where(eq(concursosGanadores.id, id));
    },

    /** @param {number} id */
    async removeGanador(id) {
        return db.delete(concursosGanadores).where(eq(concursosGanadores.id, id));
    }
};
