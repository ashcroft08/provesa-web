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
