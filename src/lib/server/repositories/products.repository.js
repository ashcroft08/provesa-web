import { db } from '$lib/server/db';
import { products } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const productsRepository = {
    /** Obtiene todos los productos ordenados */
    async getAll() {
        return await db.select().from(products).orderBy(asc(products.sortOrder));
    },

    /** Crea un nuevo producto */
    async create(data) {
        await db.insert(products).values(data);
    },

    /** Actualiza un producto por ID */
    async update(id, data) {
        await db
            .update(products)
            .set(data)
            .where(eq(products.id, id));
    },

    /** Elimina un producto por ID */
    async remove(id) {
        await db.delete(products).where(eq(products.id, id));
    }
};
