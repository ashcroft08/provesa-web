import { pgTable, serial, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core';

/**
 * Concursos/sorteos de Provesa.
 * Cada fila es un concurso con su información, imagen (Cloudinary) y estado.
 */
export const concursos = pgTable('concursos', {
    id: serial('id').primaryKey(),
    title: text('title').notNull().default(''),
    titleHighlight: text('title_highlight').default(''),
    description: text('description').default(''),
    imageUrl: text('image_url').default(''),
    badgeText: text('badge_text').default('Sorteo Activo'),
    closeDate: text('close_date').default(''),
    prizeName: text('prize_name').default(''),
    ctaText: text('cta_text').default('Ver Marcas Auspiciantes'),
    disclaimer: text('disclaimer').default(''),
    isActive: boolean('is_active').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow()
});

/**
 * Ganadores de concursos.
 * Cada fila es un ganador con foto (Cloudinary), premio y testimonio.
 */
export const concursosGanadores = pgTable('concursos_ganadores', {
    id: serial('id').primaryKey(),
    concursoId: integer('concurso_id').references(() => concursos.id, { onDelete: 'cascade' }),
    winnerName: text('winner_name').notNull().default(''),
    prize: text('prize').default(''),
    testimonial: text('testimonial').default(''),
    imageUrl: text('image_url').default(''),
    dateLabel: text('date_label').default(''),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at').defaultNow()
});
