import { slidesRepository } from '../repositories/slides.repository.js';

export const slidesService = {
    /** Obtiene todos los slides */
    async getAllSlides() {
        return await slidesRepository.getAll();
    },

    /** Agrega un nuevo slide con sortOrder automático */
    async addSlide({ imageUrl, title, highlight, description, badge, align, highlightColor }) {
        const existing = await slidesRepository.getAll();
        const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

        await slidesRepository.create({
            imageUrl, title, highlight, description, badge, align, highlightColor,
            sortOrder: nextOrder
        });
    },

    /** Actualiza un slide existente */
    async updateSlide(id, { imageUrl, title, highlight, description, badge, align, highlightColor }) {
        await slidesRepository.update(id, {
            imageUrl, title, highlight, description, badge, align, highlightColor
        });
    },

    /** Elimina un slide */
    async deleteSlide(id) {
        await slidesRepository.remove(id);
    }
};
