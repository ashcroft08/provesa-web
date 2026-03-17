import { pgTable, serial, integer, text } from 'drizzle-orm/pg-core';

export const task = pgTable('task', {
	id: serial('id').primaryKey(),
	title: text('title').notNull(),
	priority: integer('priority').notNull().default(1)
});

export * from './schemas/auth.schema';
export * from './schemas/theme_config.schema.js';
export * from './schemas/footer.schema.js';
export * from './schemas/legal_pages.schema.js';
export * from './schemas/hero_slides.schema.js';
export * from './schemas/products.schema.js';
export * from './schemas/nosotros_config.schema.js';
export * from './schemas/nosotros_page.schema.js';
export * from './schemas/sugerencias.schema.js';
export * from './schemas/sugerencias_config.schema.js';
export * from './schemas/postulaciones.schema.js';
export * from './schemas/empleo_sucursales.schema.js';
export * from './schemas/site_config.schema.js';
export * from './schemas/concursos.schema.js';
export * from './schemas/analytics.schema.js';
