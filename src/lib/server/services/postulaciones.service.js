import { postulacionesRepository } from '../repositories/postulaciones.repository.js';
import { uploadRepository } from '../repositories/upload.repository.js';

export const postulacionesService = {
    /** 
     * Obtiene el listado completo de postulaciones de empleo.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await postulacionesRepository.getAll();
    },

    /** 
     * Crea una nueva postulación y gestiona la subida del CV a Cloudinary.
     * @param {Object} data - Datos personales y mensaje.
     * @param {string} data.nombre - Nombre del candidato.
     * @param {string} data.telefono - Teléfono.
     * @param {string} data.email - Correo.
     * @param {string} data.sucursal - Sucursal a la que aplica.
     * @param {string} [data.mensaje] - Mensaje opcional.
     * @param {File|null} cvFile - Archivo del CV.
     * @returns {Promise<void>}
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

    /** 
     * Elimina una postulación del sistema por su ID.
     * @param {string} id - ID de la postulación (UUID).
     * @returns {Promise<void>}
     */
    async delete(id) {
        await postulacionesRepository.remove(id);
    }
};
