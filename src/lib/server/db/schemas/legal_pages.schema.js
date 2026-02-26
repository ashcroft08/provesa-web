import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Páginas legales editables (Privacidad, Términos, etc.)
 * Cada fila es una página identificada por un slug único.
 */
export const legalPages = pgTable('legal_pages', {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),       // 'privacidad' | 'terminos'
    title: text('title').notNull().default(''),
    content: text('content').notNull().default(''),
    updatedAt: timestamp('updated_at').defaultNow()
});
