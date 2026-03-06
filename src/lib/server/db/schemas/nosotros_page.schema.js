import { pgTable, serial, text, jsonb, timestamp } from 'drizzle-orm/pg-core';

/**
 * Contenido completo de la página /nosotros.
 * Tabla singleton (solo 1 fila). Si no existe, se usan los defaults.
 *
 * Secciones:
 *   1. Hero  – badge, título, descripción
 *   2. Historia – título, párrafos (jsonb), imagen
 *   3. Misión – título, texto
 *   4. Visión – título, texto
 *   5. Galería (misión/visión) – imágenes (jsonb array)
 */
export const nosotrosPage = pgTable('nosotros_page', {
    id: serial('id').primaryKey(),

    // ── Hero ──────────────────────────────────────────────
    heroBadge: text('hero_badge').notNull().default('Desde 2006'),
    heroTitle: text('hero_title').notNull().default('Aliados de su Crecimiento'),
    heroDescription: text('hero_description').notNull().default(
        'Conozca la historia de compromiso y servicio que nos ha convertido en el distribuidor mayorista líder de la región.'
    ),

    // ── Historia ─────────────────────────────────────────
    historyTitle: text('history_title').notNull().default('Nuestra Historia'),
    historyParagraphs: jsonb('history_paragraphs').default([
        '<strong>PROVESA SCC</strong> nació en el corazón de La Concordia con una visión clara: convertirse en el puente fundamental entre los grandes productores y los comerciantes locales.',
        'Fundada oficialmente como sociedad mercantil, iniciamos operaciones con la distribución de granos básicos. Gracias a la confianza de nuestros clientes, expandimos rápidamente nuestro portafolio para incluir una gama completa de abarrotes y productos de consumo masivo.',
        'Hoy, con más de 18 años de trayectoria, somos sinónimo de cumplimiento y seriedad. Atendemos a cientos de negocios, desde pequeñas tiendas de barrio hasta grandes autoservicios, garantizando siempre el mejor precio y abastecimiento oportuno.'
    ]),
    historyImageUrl: text('history_image_url').notNull().default(
        'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=800'
    ),

    // ── Misión ───────────────────────────────────────────
    missionTitle: text('mission_title').notNull().default('Nuestra Misión'),
    missionText: text('mission_text').notNull().default(
        'Ser el motor del comercio local, garantizando el abastecimiento eficiente de productos de consumo masivo con los más altos estándares de calidad, impulsando la rentabilidad de nuestros socios estratégicos a través de un servicio excepcional y precios competitivos.'
    ),

    // ── Visión ───────────────────────────────────────────
    visionTitle: text('vision_title').notNull().default('Nuestra Visión'),
    visionText: text('vision_text').notNull().default(
        'Consolidarnos como el grupo de distribución mayorista más confiable y moderno del país, transformando la cadena de suministro en una ventaja competitiva para cada negocio que confía en nosotros, siendo referentes de integridad y crecimiento sostenible.'
    ),

    // ── Galería (sección misión/visión) ──────────────────
    galleryImages: jsonb('gallery_images').default([
        { url: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=400', alt: 'Logística' },
        { url: 'https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=400', alt: 'Almacén' },
        { url: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaad5b?q=80&w=400', alt: 'Distribución' },
        { url: 'https://images.unsplash.com/photo-1521791136064-7986c2959213?q=80&w=400', alt: 'Equipo' }
    ]),

    updatedAt: timestamp('updated_at').defaultNow()
});
