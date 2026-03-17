import { empleoRepository } from '../repositories/empleo.repository.js';

export const empleoService = {
    /** 
     * Obtiene el listado de todas las sucursales/vacantes de empleo.
     * @returns {Promise<Array<Object>>}
     */
    async getAll() {
        return await empleoRepository.getAll();
    },

    /** 
     * Retorna solo las vacantes marcadas como activas para mostrar al público.
     * @returns {Promise<Array<Object>>}
     */
    async getActive() {
        return await empleoRepository.getActive();
    },

    /** 
     * Registra una nueva sucursal o vacante por su nombre descriptivo.
     * @param {string} nombre - Nombre de la sucursal.
     * @returns {Promise<void>}
     */
    async addSucursal(nombre) {
        await empleoRepository.create(nombre);
    },

    /** 
     * Cambia la visibilidad (activación) de una sucursal específica.
     * @param {number} id - ID de la sucursal.
     * @param {boolean} activa - Nuevo estado de visibilidad.
     * @returns {Promise<void>}
     */
    async toggleSucursal(id, activa) {
        await empleoRepository.toggleActive(id, activa);
    },

    /** 
     * Elimina permanentemente una sucursal del sistema.
     * @param {number} id - ID de la sucursal.
     * @returns {Promise<void>}
     */
    async deleteSucursal(id) {
        await empleoRepository.remove(id);
    }
};
