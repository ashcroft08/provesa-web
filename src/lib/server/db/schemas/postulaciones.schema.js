import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const postulaciones = pgTable('postulaciones', {
    id: uuid('id').defaultRandom().primaryKey(),
    nombre: text('nombre').notNull(),
    telefono: text('telefono').notNull(),
    email: text('email').notNull(),
    sucursal: text('sucursal').notNull(),
    cvUrl: text('cv_url'),
    mensaje: text('mensaje'),
    createdAt: timestamp('created_at').defaultNow().notNull()
});
