import { pgTable, text, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';

export const sugerencias = pgTable('sugerencias', {
    id: uuid('id').defaultRandom().primaryKey(),
    tipo: text('tipo').notNull(),
    nombre: text('nombre'),
    mensaje: text('mensaje').notNull(),
    leido: boolean('leido').default(false).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull()
});
