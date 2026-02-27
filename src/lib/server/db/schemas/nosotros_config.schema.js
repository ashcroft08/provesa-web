import { pgTable, serial, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Configuración de la sección "Nosotros Teaser" en la homepage.
 * 
 * Solo debe existir 1 fila (singleton). Si no existe, se usan los defaults.
 * 
 * colors: { bg, accent, textMain, textMuted, iconColor, statBg }
 * stats: [{ number, label }]
 */
export const nosotrosConfig = pgTable('nosotros_config', {
    id: serial('id').primaryKey(),
    badge: text('badge').notNull().default('Nuestra Esencia'),
    title: text('title').notNull().default('Más que distribuidores, somos'),
    titleHighlight: text('title_highlight').notNull().default('socios estratégicos'),
    description: text('description').notNull().default('Desde 2006, Provesa SCC ha sido un pilar fundamental para el comercio en La Concordia. Descubra nuestra historia, misión y los valores que nos impulsan cada día.'),
    ctaText: text('cta_text').notNull().default('Conocer Más'),
    ctaLink: text('cta_link').notNull().default('/nosotros'),
    colors: jsonb('colors').default({
        bg: '#455dd9',
        accent: '#ffd100',
        textMain: '#ffffff',
        textMuted: '#bfdbfe',
        iconColor: '#ffd100',
        statBg: 'rgba(255,255,255,0.08)'
    }),
    stats: jsonb('stats').default([
        { number: '18+', label: 'Años' },
        { number: '100%', label: 'Seriedad' },
        { number: '500+', label: 'Clientes' }
    ]),
    updatedAt: timestamp('updated_at').defaultNow()
});
