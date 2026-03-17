import { db } from '$lib/server/db';
import { pageViews } from '$lib/server/db/schemas/analytics.schema';
import { sql } from 'drizzle-orm';

export const analyticsService = {
	/** 
	 * Registra una visita a una ruta específica.
	 * @param {string} path - La ruta visitada (ej: '/nosotros').
	 * @returns {Promise<void>}
	 */
	async trackView(path) {
		try {
			// Upsert logic: insert or increment if exists
			await db.insert(pageViews)
				.values({ path, count: 1 })
				.onConflictDoUpdate({
					target: pageViews.path,
					set: { 
						count: sql`${pageViews.count} + 1`,
						lastVisit: new Date()
					}
				});
		} catch (e) {
			console.error('Error tracking view:', /** @type {any} */ (e));
		}
	},

	/**
	 * Obtiene las estadísticas de visitas.
	 * @returns {Promise<{totalViews: number, byPage: Array<{path: string, count: number, lastVisit: Date}>}>}
	 */
	async getStats() {
		try {
			// Verificamos si la tabla existe primero para evitar errores fatales en el dashboard
			const stats = await db.select().from(pageViews).orderBy(sql`${pageViews.count} DESC`);
			const totalViews = stats.reduce((acc, curr) => acc + curr.count, 0);
			return {
				totalViews,
				byPage: stats.slice(0, 10) // Top 10 pages
			};
		} catch (e) {
			// Si la tabla no existe o hay error de permisos, devolvemos datos vacíos
			console.warn('Analytics mapping failed (possibly table not created yet):', /** @type {any} */ (e).message);
			return { totalViews: 0, byPage: [] };
		}
	}
};
