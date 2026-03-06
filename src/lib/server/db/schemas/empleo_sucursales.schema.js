import { pgTable, text, timestamp, boolean, serial } from 'drizzle-orm/pg-core';

export const empleoSucursales = pgTable('empleo_sucursales', {
    id: serial('id').primaryKey(),
    nombre: text('nombre').notNull(),
    activa: boolean('activa').default(true).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});
