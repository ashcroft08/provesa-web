import { nosotrosRepository } from '../repositories/nosotros.repository.js';

export const nosotrosService = {
    /** 
     * Recupera la configuración resumida para el componente de "Nosotros" en el Home.
     * @returns {Promise<Object|null>}
     */
    async getConfig() {
        return await nosotrosRepository.getConfig();
    },

    /** 
     * Actualiza la configuración del teaser resumido de "Nosotros".
     * @param {Object} params - Datos del teaser.
     * @param {string} params.badge - Etiqueta superior.
     * @param {string} params.title - Título principal.
     * @param {string} params.titleHighlight - Texto resaltado.
     * @param {string} params.description - Párrafo descriptivo.
     * @param {string} params.ctaText - Texto del botón.
     * @param {string} params.ctaLink - Enlace del botón.
     * @param {any} params.colors - Configuración de colores.
     * @param {any} params.stats - Estadísticas (JSON).
     * @returns {Promise<void>}
     */
    async updateConfig({ badge, title, titleHighlight, description, ctaText, ctaLink, colors, stats }) {
        await nosotrosRepository.upsertConfig({
            badge, title, titleHighlight, description, ctaText, ctaLink,
            colors: typeof colors === 'string' ? JSON.parse(colors) : colors,
            stats: typeof stats === 'string' ? JSON.parse(stats) : stats
        });
    },

    /** 
     * Obtiene el contenido editorial completo de la página institucional "Nosotros".
     * @returns {Promise<Object|null>}
     */
    async getPage() {
        return await nosotrosRepository.getPage();
    },

    /** 
     * Actualiza la información detallada de la página institucional.
     * @param {Object} params - Contenido detallado de la página.
     * @param {string} params.heroBadge - Badge del hero.
     * @param {string} params.heroTitle - Título del hero.
     * @param {string} params.heroDescription - Descripción del hero.
     * @param {string} params.historyTitle - Título de historia.
     * @param {any} params.historyParagraphs - Párrafos de historia (JSON).
     * @param {string} params.historyImageUrl - Imagen de historia.
     * @param {string} params.missionTitle - Título de misión.
     * @param {string} params.missionText - Texto de misión.
     * @param {string} params.visionTitle - Título de visión.
     * @param {string} params.visionText - Texto de visión.
     * @param {any} params.galleryImages - Imágenes de galería (JSON).
     * @returns {Promise<void>}
     */
    async updatePage({
        heroBadge, heroTitle, heroDescription,
        historyTitle, historyParagraphs, historyImageUrl,
        missionTitle, missionText,
        visionTitle, visionText,
        galleryImages
    }) {
        await nosotrosRepository.upsertPage({
            heroBadge, heroTitle, heroDescription,
            historyTitle,
            historyParagraphs: typeof historyParagraphs === 'string' ? JSON.parse(historyParagraphs) : historyParagraphs,
            historyImageUrl,
            missionTitle, missionText,
            visionTitle, visionText,
            galleryImages: typeof galleryImages === 'string' ? JSON.parse(galleryImages) : galleryImages
        });
    }
};
