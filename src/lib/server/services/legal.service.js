import { legalRepository } from '../repositories/legal.repository.js';

export const legalService = {
    /** Obtiene privacidad y términos */
    async getLegalPages() {
        const pages = await legalRepository.getAll();
        const privacidad = pages.find((p) => p.slug === 'privacidad') || null;
        const terminos = pages.find((p) => p.slug === 'terminos') || null;
        return { privacidad, terminos };
    },

    /** Obtiene una página legal por slug */
    async getBySlug(slug) {
        return await legalRepository.getBySlug(slug);
    },

    /** Actualiza una página legal (upsert por slug) */
    async updateLegalPage(slug, { title, content }) {
        await legalRepository.upsert(slug, { title, content });
    }
};
