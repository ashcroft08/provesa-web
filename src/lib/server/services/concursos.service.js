import { concursosRepository } from '$lib/server/repositories/concursos.repository.js';
import { uploadRepository } from '$lib/server/repositories/upload.repository.js';

export const concursosService = {
	// ─── Datos públicos ───

	/** 
	 * Retorna la información del concurso activo y la lista total de ganadores.
	 * @returns {Promise<{concurso: Object|null, ganadores: Array<Object>}>}
	 */
	async getPublicData() {
 		const concurso = /** @type {any} */ (await concursosRepository.getActive());
 
 		// Auto-hide if active but closeDate has already passed
 		if (concurso && concurso.closeDate) {
 			const today = new Date();
 			today.setHours(0, 0, 0, 0);
 			const close = new Date(concurso.closeDate + 'T00:00:00');
 			if (close < today) {
 				// Ensure the database eventually catches up
 				await concursosRepository.update(concurso.id, { isActive: false });
 				return { concurso: null, ganadores: await concursosRepository.getAllGanadores() };
 			}
 		}
 
 		/** @type {any[]} */
 		const ganadores = await concursosRepository.getAllGanadores();
 
 		return { concurso, ganadores };
 	},

	// ─── Admin: Concursos ───

	/** 
	 * Obtiene todos los concursos registrados.
	 * @returns {Promise<Array<Object>>}
	 */
	async getAllConcursos() {
		return concursosRepository.getAll();
	},

	/** 
	 * Obtiene la lista de todos los ganadores.
	 * @returns {Promise<Array<Object>>}
	 */
	async getAllGanadores() {
		return concursosRepository.getAllGanadores();
	},

	/** 
	 * Procesa y crea un nuevo concurso desde un FormData.
	 * @param {FormData} formData - Datos del formulario.
	 * @returns {Promise<Object>}
	 */
	async addConcurso(formData) {
		const imageFile = /** @type {File|null} */ (formData.get('image'));
		let imageUrl = formData.get('imageUrl')?.toString() || '';

		if (imageFile && imageFile.size > 0) {
			const result = await uploadRepository.uploadImage(imageFile, {
				folder: 'provesa/concursos'
			});
			imageUrl = result.secure_url;
		}

		// Auto-deactivate if closeDate is before today
		let closeDate = formData.get('closeDate')?.toString() || '';
		let isActive = formData.get('isActive') === 'true';

		if (isActive && closeDate) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const close = new Date(closeDate + 'T00:00:00'); // Parse local YYYY-MM-DD
			if (close < today) {
				isActive = false;
			}
		}

		// Calcular sortOrder
 		const existing = /** @type {any[]} */ (await concursosRepository.getAll());
 		const sortOrder = existing.length > 0 ? Math.max(...existing.map((c) => c.sortOrder)) + 1 : 0;

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
			isActive,
			sortOrder
		});
	},

	/** 
	 * Actualiza los datos de un concurso existente.
	 * @param {number} id - ID del concurso.
	 * @param {FormData} formData - Nuevos datos.
	 */
    async updateConcurso(id, formData) {
		// Auto-deactivate if closeDate is before today
		let closeDate = formData.get('closeDate')?.toString() || '';
		let isActive = formData.get('isActive') === 'true';

		if (isActive && closeDate) {
			const today = new Date();
			today.setHours(0, 0, 0, 0);
			const close = new Date(closeDate + 'T00:00:00'); // Parse local YYYY-MM-DD
			if (close < today) {
				isActive = false;
			}
		}

		/** @type {Record<string, any>} */
		const data = {
			title: formData.get('title')?.toString() || '',
			titleHighlight: formData.get('titleHighlight')?.toString() || '',
			description: formData.get('description')?.toString() || '',
			badgeText: formData.get('badgeText')?.toString() || '',
			closeDate,
			prizeName: formData.get('prizeName')?.toString() || '',
			ctaText: formData.get('ctaText')?.toString() || '',
			disclaimer: formData.get('disclaimer')?.toString() || '',
			isActive
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

	/** 
	 * Elimina un concurso por su ID.
	 * @param {number} id - ID del concurso.
	 */
	async deleteConcurso(id) {
		return concursosRepository.remove(id);
	},

	// ─── Admin: Ganadores ───

	/** 
	 * Registra un nuevo ganador.
	 * @param {FormData} formData - Datos del ganador.
	 * @returns {Promise<Object>}
	 */
    async addGanador(formData) {
		const imageFile = /** @type {File|null} */ (formData.get('image'));
		let imageUrl = formData.get('imageUrl')?.toString() || '';

		if (imageFile && imageFile.size > 0) {
			const result = await uploadRepository.uploadImage(imageFile, {
				folder: 'provesa/concursos/ganadores'
			});
			imageUrl = result.secure_url;
		}

		// Calcular sortOrder
 		const existing = /** @type {any[]} */ (await concursosRepository.getAllGanadores());
 		const sortOrder = existing.length > 0 ? Math.max(...existing.map((g) => g.sortOrder)) + 1 : 0;

		const concursoId = parseInt(formData.get('concursoId')?.toString() || '0') || null;

		const newGanador = await concursosRepository.createGanador({
			concursoId,
			winnerName: formData.get('winnerName')?.toString() || '',
			prize: formData.get('prize')?.toString() || '',
			testimonial: formData.get('testimonial')?.toString() || '',
			imageUrl,
			dateLabel: formData.get('dateLabel')?.toString() || '',
			sortOrder
		});

		if (concursoId) {
			await concursosRepository.update(concursoId, { isActive: false });
		}

		return newGanador;
	},

	/** 
	 * Actualiza los datos de un ganador.
	 * @param {number} id - ID del ganador record.
	 * @param {FormData} formData - Datos a actualizar.
	 * @returns {Promise<Object>}
	 */
	async updateGanador(id, formData) {
		const concursoId = parseInt(formData.get('concursoId')?.toString() || '0') || null;

		/** @type {Record<string, any>} */
		const data = {
			concursoId,
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

		const updatedGanador = await concursosRepository.updateGanador(id, data);

		if (concursoId) {
			await concursosRepository.update(concursoId, { isActive: false });
		}

		return updatedGanador;
	},

	/** 
	 * Elimina un registro de ganador por ID.
	 * @param {number} id - ID del registro.
	 */
	async deleteGanador(id) {
		return concursosRepository.removeGanador(id);
	}
};
