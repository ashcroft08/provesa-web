import { siteConfigRepository } from '../repositories/site-config.repository.js';

export const themeService = {
    /** Lee los colores actuales de la base de datos (site_config) */
    async getThemeColors() {
        try {
            const config = await siteConfigRepository.getAll();
            
            return {
                primary: config['theme_primary'] || '#455dd9',
                secondary: config['theme_secondary'] || '#ffd100',
                accent: config['theme_accent'] || '#e4002b',
                background: config['theme_background'] || '#ffffff',
                navbarHover: config['theme_navbar_hover'] || '#455dd9'
            };
        } catch (e) {
            console.error('Error leyendo temas de siteConfig:', e);
            return {
                primary: '#455dd9',
                secondary: '#ffd100',
                accent: '#e4002b',
                background: '#ffffff',
                navbarHover: '#455dd9'
            };
        }
    },

    /**
     * Actualiza los colores en la base de datos (site_config).
     * @param {Object} colors
     * @param {string} [colors.primary]
     * @param {string} [colors.secondary]
     * @param {string} [colors.accent]
     * @param {string} [colors.background]
     * @param {string} [colors.navbarHover]
     */
    async updateThemeColors({ primary, secondary, accent, background, navbarHover }) {
        const promises = [];
        
        if (primary) promises.push(siteConfigRepository.upsert('theme_primary', primary));
        if (secondary) promises.push(siteConfigRepository.upsert('theme_secondary', secondary));
        if (accent) promises.push(siteConfigRepository.upsert('theme_accent', accent));
        if (background) promises.push(siteConfigRepository.upsert('theme_background', background));
        if (navbarHover) promises.push(siteConfigRepository.upsert('theme_navbar_hover', navbarHover));

        try {
            await Promise.all(promises);
        } catch (e) {
            console.error('Error escribiendo temas en siteConfig:', e);
            throw new Error('No se pudieron guardar los colores en la base de datos.');
        }
    }
};
