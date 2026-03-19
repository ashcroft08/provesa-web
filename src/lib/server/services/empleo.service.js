import { empleoRepository } from '../repositories/empleo.repository.js';

export const empleoService = {
    /** Obtiene todas las sucursales de empleo */
    async getAll() {
        return await empleoRepository.getAll();
    },

    /** Obtiene solo las sucursales activas */
    async getActive() {
        return await empleoRepository.getActive();
    },

    /** Agrega una nueva sucursal */
    async addSucursal(nombre) {
        await empleoRepository.create(nombre);
    },

    /** Activa o desactiva una sucursal */
    async toggleSucursal(id, activa) {
        await empleoRepository.toggleActive(id, activa);
    },

    /** Elimina una sucursal */
    async deleteSucursal(id) {
        await empleoRepository.remove(id);
    }
};
