import { db } from '../index.js';
import { themeConfig } from '../schema.js';
import { count } from 'drizzle-orm';

/**
 * Inicializa la configuración del tema si la tabla está vacía.
 */
async function seedTheme() {
    console.log('🎨 Iniciando el sembrado de colores del tema...');

    try {
        // Verificar si ya existe alguna configuración
        const existing = await db.select({ value: count() }).from(themeConfig);

        if (existing[0].value === 0) {
            await db.insert(themeConfig).values({
                primaryColor: '#1565C0',
                secondaryColor: '#FFD100',
                accentColor: '#E4002B',
                backgroundColor: '#FAFAF7'
            });
            console.log('✅ Configuración de tema inicial creada con éxito.');
        } else {
            console.log('ℹ️ La configuración de tema ya existe, saltando...');
        }
    } catch (error) {
        console.error('❌ Error al sembrar el tema:', error);
    }
}

seedTheme();
