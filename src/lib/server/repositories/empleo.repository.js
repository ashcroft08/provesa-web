import { db } from '$lib/server/db';
import { empleoSucursales } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const empleoRepository = {
    /** 
     * Obtiene todas las sucursales de empleo registradas.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await db.select().from(empleoSucursales).orderBy(asc(empleoSucursales.nombre));
    },

    /** 
     * Filtra y devuelve solo las sucursales que están marcadas como activas.
     * @returns {Promise<Array<Object>>}
     */
    async getActive() {
        return await db.select().from(empleoSucursales).where(eq(empleoSucursales.activa, true));
    },

    /** 
     * Crea una nueva vacante o sucursal por su nombre.
     * @param {string} nombre - Nombre de la sucursal/vacante.
     * @returns {Promise<void>}
     */
    async create(nombre) {
        await db.insert(empleoSucursales).values({ nombre });
    },

    /** 
     * Cambia el estado de activación de una sucursal.
     * @param {number} id - ID de la sucursal.
     * @param {boolean} activa - Nuevo estado.
     * @returns {Promise<void>}
     */
    async toggleActive(id, activa) {
        await db
            .update(empleoSucursales)
            .set({ activa })
            .where(eq(empleoSucursales.id, id));
    },

    /** 
     * Elimina una sucursal del listado por su ID.
     * @param {number} id - ID de la sucursal.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await db.delete(empleoSucursales).where(eq(empleoSucursales.id, id));
    }
};
