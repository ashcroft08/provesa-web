import { siteConfigRepository } from '../repositories/site-config.repository.js';
import { uploadRepository } from '../repositories/upload.repository.js';

export const siteConfigService = {
    /** 
     * Obtiene todas las configuraciones globales del sitio como un objeto clave-valor.
     * @returns {Promise<Record<string, string>>}
     */
    async getConfigMap() {
        return await siteConfigRepository.getAll();
    },

    /** 
     * Gestiona la subida del logo corporativo y actualiza la configuración 'logoUrl'.
     * @param {File} logoFile - Archivo de imagen del logo.
     * @returns {Promise<void>}
     */
    async updateLogo(logoFile) {
        const result = await uploadRepository.uploadImage(logoFile, {
            folder: 'provesa-web/site',
            public_id: 'logo',
            overwrite: true
        });

        await siteConfigRepository.upsert('logoUrl', result.secure_url);
    }
};
