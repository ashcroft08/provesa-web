import { concursosRepository } from '$lib/server/repositories/concursos.repository.js';
import { uploadRepository } from '$lib/server/repositories/upload.repository.js';

export const concursosService = {
    // ─── Datos públicos ───

    /** Retorna el concurso activo + sus ganadores para la página pública */
    async getPublicData() {
        const concurso = await concursosRepository.getActive();
        /** @type {Awaited<ReturnType<typeof concursosRepository.getAllGanadores>>} */
        let ganadores = [];
        if (concurso) {
            ganadores = await concursosRepository.getGanadoresByConcurso(concurso.id);
        }
        return { concurso, ganadores };
    },

    // ─── Admin: Concursos ───

    async getAllConcursos() {
        return concursosRepository.getAll();
    },

    async getAllGanadores() {
        return concursosRepository.getAllGanadores();
    },

    /** @param {FormData} formData */
    async addConcurso(formData) {
        const imageFile = /** @type {File|null} */ (formData.get('image'));
        let imageUrl = '';

        if (imageFile && imageFile.size > 0) {
            const result = await uploadRepository.uploadImage(imageFile, {
                folder: 'provesa/concursos'
            });
            imageUrl = result.secure_url;
        }

        // Calcular sortOrder
        const existing = await concursosRepository.getAll();
        const sortOrder = existing.length > 0
            ? Math.max(...existing.map(c => c.sortOrder)) + 1
            : 0;

        return concursosRepository.create({
            title: formData.get('title')?.toString() || '',
            titleHighlight: formData.get('titleHighlight')?.toString() || '',
            description: formData.get('description')?.toString() || '',
            imageUrl,
            badgeText: formData.get('badgeText')?.toString() || 'Sorteo Activo',
            closeDate: formData.get('closeDate')?.toString() || '',
            prizeName: formData.get('prizeName')?.toString() || '',
            ctaText: formData.get('ctaText')?.toString() || 'Ver Marcas Auspiciantes',
            disclaimer: formData.get('disclaimer')?.toString() || '',
            isActive: formData.get('isActive') === 'true',
            sortOrder
        });
    },

    /**
     * @param {number} id
     * @param {FormData} formData
     */
    async updateConcurso(id, formData) {
        /** @type {Record<string, any>} */
        const data = {
            title: formData.get('title')?.toString() || '',
            titleHighlight: formData.get('titleHighlight')?.toString() || '',
            description: formData.get('description')?.toString() || '',
            badgeText: formData.get('badgeText')?.toString() || '',
            closeDate: formData.get('closeDate')?.toString() || '',
            prizeName: formData.get('prizeName')?.toString() || '',
            ctaText: formData.get('ctaText')?.toString() || '',
            disclaimer: formData.get('disclaimer')?.toString() || '',
            isActive: formData.get('isActive') === 'true'
        };

        const imageFile = /** @type {File|null} */ (formData.get('image'));
        if (imageFile && imageFile.size > 0) {
            const result = await uploadRepository.uploadImage(imageFile, {
                folder: 'provesa/concursos'
            });
            data.imageUrl = result.secure_url;
        }

        return concursosRepository.update(id, data);
    },

    /** @param {number} id */
    async deleteConcurso(id) {
        return concursosRepository.remove(id);
    },

    // ─── Admin: Ganadores ───

    /** @param {FormData} formData */
    async addGanador(formData) {
        const imageFile = /** @type {File|null} */ (formData.get('image'));
        let imageUrl = '';

        if (imageFile && imageFile.size > 0) {
            const result = await uploadRepository.uploadImage(imageFile, {
                folder: 'provesa/concursos/ganadores'
            });
            imageUrl = result.secure_url;
        }

        // Calcular sortOrder
        const existing = await concursosRepository.getAllGanadores();
        const sortOrder = existing.length > 0
            ? Math.max(...existing.map(g => g.sortOrder)) + 1
            : 0;

        return concursosRepository.createGanador({
            concursoId: parseInt(formData.get('concursoId')?.toString() || '0') || null,
            winnerName: formData.get('winnerName')?.toString() || '',
            prize: formData.get('prize')?.toString() || '',
            testimonial: formData.get('testimonial')?.toString() || '',
            imageUrl,
            dateLabel: formData.get('dateLabel')?.toString() || '',
            sortOrder
        });
    },

    /**
     * @param {number} id
     * @param {FormData} formData
     */
    async updateGanador(id, formData) {
        /** @type {Record<string, any>} */
        const data = {
            concursoId: parseInt(formData.get('concursoId')?.toString() || '0') || null,
            winnerName: formData.get('winnerName')?.toString() || '',
            prize: formData.get('prize')?.toString() || '',
            testimonial: formData.get('testimonial')?.toString() || '',
            dateLabel: formData.get('dateLabel')?.toString() || ''
        };

        const imageFile = /** @type {File|null} */ (formData.get('image'));
        if (imageFile && imageFile.size > 0) {
            const result = await uploadRepository.uploadImage(imageFile, {
                folder: 'provesa/concursos/ganadores'
            });
            data.imageUrl = result.secure_url;
        }

        return concursosRepository.updateGanador(id, data);
    },

    /** @param {number} id */
    async deleteGanador(id) {
        return concursosRepository.removeGanador(id);
    }
};
