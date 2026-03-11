import { pgTable, text, serial } from 'drizzle-orm/pg-core';

export const siteConfig = pgTable('site_config', {
    id: serial('id').primaryKey(),
    key: text('key').notNull().unique(),
    value: text('value').notNull()
});
