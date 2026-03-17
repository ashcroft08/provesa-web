import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const productsRepository = {
    /** 
     * Obtiene todos los productos ordenados por su orden de visualización.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await db.select().from(products).orderBy(asc(products.sortOrder));
    },

    /** 
     * Crea un nuevo producto en la base de datos.
     * @param {Object} data - Los datos del producto.
     * @returns {Promise<void>}
     */
    async create(data) {
        await db.insert(products).values(data);
    },

    /** 
     * Actualiza la información de un producto existente.
     * @param {number} id - ID del producto.
     * @param {Object} data - Datos a actualizar.
     * @returns {Promise<void>}
     */
    async update(id, data) {
        await db
            .update(products)
            .set(data)
            .where(eq(products.id, id));
    },

    /** 
     * Elimina un producto de la base de datos por su ID.
     * @param {number} id - ID del producto.
     * @returns {Promise<void>}
     */
    async remove(id) {
        await db.delete(products).where(eq(products.id, id));
    }
};
