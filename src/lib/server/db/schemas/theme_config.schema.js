import { pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

/**
 * Tabla para almacenar la configuración visual (colores) del sitio.
 */
export const themeConfig = pgTable('theme_config', {
    id: serial('id').primaryKey(),
    primaryColor: text('primary_color').notNull().default('#1565C0'),
    secondaryColor: text('secondary_color').notNull().default('#FFD100'),
    accentColor: text('accent_color').notNull().default('#E4002B'),
    backgroundColor: text('background_color').notNull().default('#FAFAF7'),
    updatedAt: timestamp('updated_at').defaultNow()
});
