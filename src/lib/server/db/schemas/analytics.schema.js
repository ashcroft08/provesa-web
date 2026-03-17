import { pgTable, text, integer, timestamp, uuid } from 'drizzle-orm/pg-core';

export const pageViews = pgTable('page_views', {
	id: uuid('id').defaultRandom().primaryKey(),
	path: text('path').notNull().unique(),
	count: integer('count').default(0).notNull(),
	lastVisit: timestamp('last_visit').defaultNow().notNull()
});
