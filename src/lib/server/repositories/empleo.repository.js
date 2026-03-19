import { db } from '$lib/server/db';
import { empleoSucursales } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const empleoRepository = {
    /** Obtiene todas las sucursales de empleo ordenadas por nombre */
    async getAll() {
        return await db.select().from(empleoSucursales).orderBy(asc(empleoSucursales.nombre));
    },

    /** Obtiene solo las sucursales activas */
    async getActive() {
        return await db.select().from(empleoSucursales).where(eq(empleoSucursales.activa, true));
    },

    /** Crea una nueva sucursal */
    async create(nombre) {
        await db.insert(empleoSucursales).values({ nombre });
    },

    /** Activa o desactiva una sucursal */
    async toggleActive(id, activa) {
        await db
            .update(empleoSucursales)
            .set({ activa })
            .where(eq(empleoSucursales.id, id));
    },

    /** Elimina una sucursal por ID */
    async remove(id) {
        await db.delete(empleoSucursales).where(eq(empleoSucursales.id, id));
    }
};
