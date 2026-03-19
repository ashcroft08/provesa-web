import { db } from '$lib/server/db';
import { footerInfo, footerBranches } from '$lib/server/db/schema';
import { eq, asc } from 'drizzle-orm';

export const footerRepository = {
	/** Obtiene la info general del footer (singleton) */
	async getInfo() {
		const [info] = await db.select().from(footerInfo).limit(1);
		return info || null;
	},

	/** Obtiene las sucursales ordenadas */
	async getBranches() {
		return await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
	},

	/** Crea o actualiza la info del footer */
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

	/** Agrega una sucursal */
	async addBranch(data) {
		const branches = await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
		const nextOrder = branches.length > 0 ? branches[branches.length - 1].sortOrder + 1 : 0;
		await db.insert(footerBranches).values({ ...data, sortOrder: nextOrder });
	},

	/** Elimina una sucursal por ID */
	async deleteBranch(id) {
		await db.delete(footerBranches).where(eq(footerBranches.id, id));
	}
};
