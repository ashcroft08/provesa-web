import cloudinary from '$lib/server/cloudinary.js';

export const uploadRepository = {
    /**
     * Sube una imagen a Cloudinary
     * @param {File} file - Archivo a subir
     * @param {object} options - Opciones de Cloudinary (folder, public_id, etc.)
     * @returns {Promise<import('cloudinary').UploadApiResponse>}
     */
    async uploadImage(file, options = {}) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        return await cloudinary.uploader.upload(base64, {
            resource_type: 'image',
            ...options
        });
    },

    /**
     * Sube un archivo genérico a Cloudinary (PDF, imágenes, etc.)
     * @param {File} file - Archivo a subir
     * @param {object} options - Opciones de Cloudinary
     * @returns {Promise<import('cloudinary').UploadApiResponse>}
     */
    async uploadFile(file, options = {}) {
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        return await cloudinary.uploader.upload(base64, {
            resource_type: 'auto',
            ...options
        });
    }
};
