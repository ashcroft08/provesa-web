import { pgTable, serial, jsonb } from 'drizzle-orm/pg-core';

export const sugerenciasConfig = pgTable('sugerencias_config', {
    id: serial('id').primaryKey(),
    opciones: jsonb('opciones').default(['Sugerencia de Servicio', 'Nuevo Producto Requerido', 'Reclamo', 'Felicitación']).notNull()
});
