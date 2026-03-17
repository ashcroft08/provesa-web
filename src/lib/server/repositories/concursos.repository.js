import { db } from '$lib/server/db/index.js';
import { concursos, concursosGanadores } from '$lib/server/db/schema.js';
import { eq, asc } from 'drizzle-orm';

export const concursosRepository = {
    // ─── Concursos ───

    /** 
     * Obtiene todos los concursos registrados, ordenados por su prioridad.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return db.select().from(concursos).orderBy(asc(concursos.sortOrder));
    },

    /** 
     * Obtiene el primer concurso que se encuentre marcado como activo.
     * @returns {Promise<Object|null>}
     */
    async getActive() {
        const rows = await db.select().from(concursos).where(eq(concursos.isActive, true)).limit(1);
        return rows[0] || null;
    },

    /** @param {number} id */
    async getById(id) {
        const rows = await db.select().from(concursos).where(eq(concursos.id, id)).limit(1);
        return rows[0] || null;
    },

    /** 
     * Crea un nuevo registro de concurso.
     * @param {any} data - Datos del concurso a insertar.
     * @returns {Promise<Object>} El concurso creado.
     */
    async create(data) {
        const rows = await db.insert(concursos).values(data).returning();
        return rows[0];
    },

    /**
     * Actualiza los datos de un concurso existente.
     * @param {number} id - ID del concurso.
     * @param {any} data - Datos parciales a actualizar.
     */
    async update(id, data) {
        return db.update(concursos).set(data).where(eq(concursos.id, id));
    },

    /** 
     * Elimina un concurso y sus asociaciones por ID.
     * @param {number} id - ID del concurso.
     */
    async remove(id) {
        return db.delete(concursos).where(eq(concursos.id, id));
    },

    // ─── Ganadores ───

    /** 
     * Obtiene la lista de todos los ganadores históricos de concursos.
     * @returns {Promise<Array<Object>>}
     */
    async getAllGanadores() {
        return db.select().from(concursosGanadores).orderBy(asc(concursosGanadores.sortOrder));
    },

    /** 
     * Recupera los ganadores asociados a un concurso específico.
     * @param {number} concursoId - ID del concurso de origen.
     * @returns {Promise<Array<Object>>}
     */
    async getGanadoresByConcurso(concursoId) {
        return db.select().from(concursosGanadores)
            .where(eq(concursosGanadores.concursoId, concursoId))
            .orderBy(asc(concursosGanadores.sortOrder));
    },

    /** 
     * Registra un nuevo ganador para un concurso.
     * @param {any} data - Información del ganador.
     * @returns {Promise<Object>} El ganador creado.
     */
    async createGanador(data) {
        const rows = await db.insert(concursosGanadores).values(data).returning();
        return rows[0];
    },

    /**
     * Actualiza la información de un ganador.
     * @param {number} id - ID del registro del ganador.
     * @param {any} data - Datos a actualizar.
     */
    async updateGanador(id, data) {
        return db.update(concursosGanadores).set(data).where(eq(concursosGanadores.id, id));
    },

    /** 
     * Elimina un registro de ganador por ID.
     * @param {number} id - ID del registro.
     */
    async removeGanador(id) {
        return db.delete(concursosGanadores).where(eq(concursosGanadores.id, id));
    }
};
