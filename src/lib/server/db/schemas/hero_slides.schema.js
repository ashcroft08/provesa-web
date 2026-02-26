import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * Slides del hero/banner principal.
 * Cada fila es un slide con imagen, textos y configuración de alineación.
 */
export const heroSlides = pgTable('hero_slides', {
    id: serial('id').primaryKey(),
    imageUrl: text('image_url').notNull(),
    title: text('title').notNull().default(''),
    highlight: text('highlight').default(''),
    description: text('description').default(''),
    badge: text('badge').default(''),
    align: text('align').notNull().default('left'),       // 'left' | 'center' | 'right'
    highlightColor: text('highlight_color').default('text-accent-yellow'), // clase CSS del highlight
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow()
});
