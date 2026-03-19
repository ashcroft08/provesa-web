import { postulacionesRepository } from '../repositories/postulaciones.repository.js';
import { uploadRepository } from '../repositories/upload.repository.js';

export const postulacionesService = {
    /** Obtiene todas las postulaciones */
    async getAll() {
        return await postulacionesRepository.getAll();
    },

    /**
     * Crea una nueva postulación, subiendo CV a Cloudinary si se proporciona
     * @param {object} data - Datos de la postulación
     * @param {File|null} cvFile - Archivo CV (opcional)
     */
    async create({ nombre, telefono, email, sucursal, mensaje }, cvFile) {
        let cvUrl = null;

        if (cvFile && cvFile instanceof File && cvFile.size > 0) {
            const result = await uploadRepository.uploadFile(cvFile, {
                folder: 'provesa-web/postulaciones'
            });
            cvUrl = result.secure_url;
        }

        await postulacionesRepository.create({
            nombre, telefono, email, sucursal, cvUrl, mensaje
        });
    },

    /** Elimina una postulación por ID */
    async delete(id) {
        await postulacionesRepository.remove(id);
    }
};
