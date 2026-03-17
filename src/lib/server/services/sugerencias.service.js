import { sugerenciasRepository } from '../repositories/sugerencias.repository.js';

export const sugerenciasService = {
    /** 
     * Obtiene el listado de todas las sugerencias de la buzón.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await sugerenciasRepository.getAll();
    },

    /** 
     * Crea una nueva sugerencia o mensaje de contacto.
     * @param {Object} params - Datos del mensaje.
     * @param {string} params.tipo - Categoría de la sugerencia.
     * @param {string} params.nombre - Nombre del remitente.
     * @param {string} params.mensaje - Contenido del mensaje.
     * @returns {Promise<void>}
     */
    async create({ tipo, nombre, mensaje }) {
        await sugerenciasRepository.create({ tipo, nombre, mensaje });
    },

    /** 
     * Marca una sugerencia como leída.
     * @param {string} id - ID de la sugerencia (UUID).
     * @returns {Promise<void>}
     */
    async markAsRead(id) {
        await sugerenciasRepository.markAsRead(id);
    },

    /** 
     * Elimina una sugerencia de la papelera.
     * @param {string} id - ID de la sugerencia (UUID).
     * @returns {Promise<void>}
     */
    async delete(id) {
        await sugerenciasRepository.remove(id);
    },

    /** 
     * Obtiene la configuración de tipos de sugerencia para el formulario.
     * @returns {Promise<Object|null>}
     */
    async getConfig() {
        return await sugerenciasRepository.getConfig();
    },

    /** 
     * Actualiza las opciones del desplegable de tipos de sugerencia.
     * @param {any} opciones - Array de opciones (o string JSON).
     * @returns {Promise<void>}
     */
    async updateConfig(opciones) {
        const parsed = typeof opciones === 'string' ? JSON.parse(opciones) : opciones;
        await sugerenciasRepository.upsertConfig(parsed);
    }
};
