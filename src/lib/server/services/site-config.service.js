import { siteConfigRepository } from '../repositories/site-config.repository.js';
import { uploadRepository } from '../repositories/upload.repository.js';

export const siteConfigService = {
    /** Obtiene toda la configuración como mapa key-value */
    async getConfigMap() {
        return await siteConfigRepository.getAll();
    },

    /**
     * Actualiza el logo del sitio (sube a Cloudinary y guarda URL en config)
     * @param {File} logoFile - Archivo del logo
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
