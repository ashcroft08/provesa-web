import { slidesRepository } from '../repositories/slides.repository.js';

export const slidesService = {
    /** 
     * Obtiene el listado de slides para el carrusel de la página de inicio.
     * @returns {Promise<Array<Object>>}
     */
    async getAllSlides() {
        return await slidesRepository.getAll();
    },

    /** 
     * Crea un nuevo slide calculando el orden automáticamente.
     * @param {Object} params - Datos del slide.
     * @param {string} params.imageUrl - URL de la imagen.
     * @param {string} params.title - Título.
     * @param {string} [params.highlight] - Texto resaltado.
     * @param {string} [params.description] - Descripción corta.
     * @param {string} [params.badge] - Badge superior.
     * @param {string} [params.align] - Alineación (center/left/right).
     * @param {string} [params.highlightColor] - Color del resaltado.
     * @returns {Promise<void>}
     */
    async addSlide({ imageUrl, title, highlight, description, badge, align, highlightColor }) {
        const existing = /** @type {any[]} */ (await slidesRepository.getAll());
        const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

        await slidesRepository.create({
            imageUrl, title, highlight, description, badge, align, highlightColor,
            sortOrder: nextOrder
        });
    },

    /** 
     * Actualiza un slide existente.
     * @param {number} id - ID del slide.
     * @param {Object} params - Datos a actualizar.
     * @param {string} [params.imageUrl]
     * @param {string} [params.title]
     * @param {string} [params.highlight]
     * @param {string} [params.description]
     * @param {string} [params.badge]
     * @param {string} [params.align]
     * @param {string} [params.highlightColor]
     * @returns {Promise<void>}
     */
    async updateSlide(id, { imageUrl, title, highlight, description, badge, align, highlightColor }) {
        await slidesRepository.update(id, {
            imageUrl, title, highlight, description, badge, align, highlightColor
        });
    },

    /** 
     * Elimina permanentemente un slide.
     * @param {number} id - ID del slide.
     * @returns {Promise<void>}
     */
    async deleteSlide(id) {
        await slidesRepository.remove(id);
    }
};
