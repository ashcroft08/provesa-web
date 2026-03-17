import { db } from '$lib/server/db';
import { footerInfo, footerBranches } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const footerRepository = {
	/** 
	 * Recupera la información global de contacto y redes sociales del footer.
	 * @returns {Promise<Object|null>}
	 */
	async getInfo() {
		const [info] = await db.select().from(footerInfo).limit(1);
		return info || null;
	},

	/** 
	 * Obtiene la lista completa de sucursales para mostrar en el pie de página.
	 * @returns {Promise<Array<Object>>}
	 */
	async getBranches() {
		return await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
	},

	/** 
	 * Actualiza o inserta la información de contacto del footer.
	 * @param {Object} data - Objeto con redes sociales y datos de contacto.
	 * @returns {Promise<void>}
	 */
	async upsertInfo(data) {
		const [existing] = await db.select().from(footerInfo).limit(1);

		if (existing) {
			await db
				.update(footerInfo)
				.set({ ...data, updatedAt: new Date() })
				.where(eq(footerInfo.id, existing.id));
		} else {
			await db.insert(footerInfo).values(data);
		}
	},

	/** 
	 * Añade una nueva sucursal al footer calculando automáticamente el siguiente orden.
	 * @param {any} data - Datos de la sucursal (nombre, dirección, etc).
	 * @returns {Promise<void>}
	 */
	async addBranch(data) {
		const branches = await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
		const nextOrder = branches.length > 0 ? branches[branches.length - 1].sortOrder + 1 : 0;
		await db.insert(footerBranches).values({ ...data, sortOrder: nextOrder });
	},

	/** 
	 * Elimina una sucursal del footer por su ID.
	 * @param {number} id - ID de la sucursal.
	 * @returns {Promise<void>}
	 */
	async deleteBranch(id) {
		await db.delete(footerBranches).where(eq(footerBranches.id, id));
	}
};
