import { sugerenciasRepository } from '../repositories/sugerencias.repository.js';

export const sugerenciasService = {
    /** Obtiene todas las sugerencias */
    async getAll() {
        return await sugerenciasRepository.getAll();
    },

    /** Crea una nueva sugerencia */
    async create({ tipo, nombre, mensaje }) {
        await sugerenciasRepository.create({ tipo, nombre, mensaje });
    },

    /** Marca una sugerencia como leída */
    async markAsRead(id) {
        await sugerenciasRepository.markAsRead(id);
    },

    /** Elimina una sugerencia */
    async delete(id) {
        await sugerenciasRepository.remove(id);
    },

    /** Obtiene la configuración de opciones del dropdown */
    async getConfig() {
        return await sugerenciasRepository.getConfig();
    },

    /** Actualiza las opciones del dropdown */
    async updateConfig(opciones) {
        const parsed = typeof opciones === 'string' ? JSON.parse(opciones) : opciones;
        await sugerenciasRepository.upsertConfig(parsed);
    }
};
