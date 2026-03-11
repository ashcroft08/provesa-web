import { nosotrosRepository } from '../repositories/nosotros.repository.js';

export const nosotrosService = {
    /** Obtiene la configuración del teaser */
    async getConfig() {
        return await nosotrosRepository.getConfig();
    },

    /** Actualiza la configuración del teaser Nosotros */
    async updateConfig({ badge, title, titleHighlight, description, ctaText, ctaLink, colors, stats }) {
        await nosotrosRepository.upsertConfig({
            badge, title, titleHighlight, description, ctaText, ctaLink,
            colors: typeof colors === 'string' ? JSON.parse(colors) : colors,
            stats: typeof stats === 'string' ? JSON.parse(stats) : stats
        });
    },

    /** Obtiene el contenido de la página /nosotros */
    async getPage() {
        return await nosotrosRepository.getPage();
    },

    /** Actualiza el contenido de la página /nosotros */
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
