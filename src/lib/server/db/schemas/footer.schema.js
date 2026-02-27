import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

/**
 * Información general de la empresa para el footer.
 * Solo debe existir una fila (singleton).
 */
export const footerInfo = pgTable('footer_info', {
    id: serial('id').primaryKey(),
    description: text('description').default(''),
    address: text('address').default(''),
    phone: text('phone').default(''),
    mobile: text('mobile').default(''),
    email: text('email').default(''),
    facebookUrl: text('facebook_url').default(''),
    instagramUrl: text('instagram_url').default(''),
    tiktokUrl: text('tiktok_url').default(''),
    whatsappUrl: text('whatsapp_url').default(''),
    updatedAt: timestamp('updated_at').defaultNow()
});

/**
 * Sucursales dinámicas que se muestran en el footer.
 */
export const footerBranches = pgTable('footer_branches', {
    id: serial('id').primaryKey(),
    name: text('name').notNull(),
    address: text('address').default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow()
});
