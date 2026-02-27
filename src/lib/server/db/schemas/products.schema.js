import { pgTable, serial, text, integer, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Productos de la sección principal de la homepage.
 * 
 * images: string[] — URLs de imágenes del carrusel
 * features: { title: string, desc: string, icon: string }[] — características con ícono
 * categories: { num: string, name: string, desc: string }[] — categorías numeradas
 * 
 * Un producto puede tener features O categories (no ambos usualmente).
 */
export const products = pgTable('products', {
    id: serial('id').primaryKey(),
    name: text('name').notNull().default(''),
    description: text('description').default(''),
    images: jsonb('images').default([]),
    features: jsonb('features').default([]),
    categories: jsonb('categories').default([]),
    align: text('align').notNull().default('left'),          // 'left' | 'right'
    accentColor: text('accent_color').notNull().default('primary'), // 'primary' | 'accent'
    displayType: text('display_type').notNull().default('features'), // 'features' | 'categories'
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow()
});
