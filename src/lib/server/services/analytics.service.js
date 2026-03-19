import { db } from '$lib/server/db';
import { pageViews } from '$lib/server/db/schemas/analytics.schema';
import { sql } from 'drizzle-orm';

export const analyticsService = {
	/** @param {string} path */
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
			console.error('Error tracking view:', e);
		}
	},

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
			console.warn('Analytics mapping failed (possibly table not created yet):', e.message);
			return { totalViews: 0, byPage: [] };
		}
	}
};
