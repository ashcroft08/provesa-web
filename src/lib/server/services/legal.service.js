import { legalRepository } from '../repositories/legal.repository.js';

export const legalService = {
    /** 
     * Obtiene los registros de las páginas de Privacidad y Términos y Condiciones.
     * @returns {Promise<{privacidad: any, terminos: any}>}
     */
    async getLegalPages() {
        const pages = await legalRepository.getAll();
        const privacidad = pages.find((p) => /** @type {any} */ (p).slug === 'privacidad') || null;
        const terminos = pages.find((p) => /** @type {any} */ (p).slug === 'terminos') || null;
        return { privacidad, terminos };
    },

    /** 
     * Recupera el contenido de una página legal usando su slug (ej: 'privacidad').
     * @param {string} slug - Identificador de la página.
     * @returns {Promise<Object|null>}
     */
    async getBySlug(slug) {
        return await legalRepository.getBySlug(slug);
    },

    /** 
     * Actualiza o crea el contenido de una página legal.
     * @param {string} slug - Identificador de la página.
     * @param {Object} params - Parámetros de la página.
     * @param {string} params.title - Título.
     * @param {string} params.content - Contenido HTML.
     * @returns {Promise<void>}
     */
    async updateLegalPage(slug, { title, content }) {
        await legalRepository.upsert(slug, { title, content });
    }
};
