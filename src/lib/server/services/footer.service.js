import { footerRepository } from '../repositories/footer.repository.js';

export const footerService = {
    /** 
     * Obtiene toda la información necesaria para renderizar el pie de página.
     * @returns {Promise<{info: Object|null, branches: Array<Object>}>}
     */
    async getFooterData() {
        const [info, branches] = await Promise.all([
            footerRepository.getInfo(),
            footerRepository.getBranches()
        ]);
        return { info, branches };
    },

    /** 
     * Actualiza la información general del footer.
     * @param {Object} params - Datos de contacto.
     * @param {string} params.description - Descripción de la empresa.
     * @param {string} params.address - Dirección principal.
     * @param {string} params.phone - Teléfono fijo.
     * @param {string} params.mobile - Teléfono celular.
     * @param {string} params.email - Correo electrónico.
     * @param {string} [params.facebookUrl] - Link a Facebook.
     * @param {string} [params.instagramUrl] - Link a Instagram.
     * @param {string} [params.tiktokUrl] - Link a TikTok.
     * @param {string} [params.whatsappUrl] - Link a WhatsApp.
     * @returns {Promise<void>}
     */
    async updateFooterInfo({ description, address, phone, mobile, email, facebookUrl, instagramUrl, tiktokUrl, whatsappUrl }) {
        await footerRepository.upsertInfo({
            description, address, phone, mobile, email,
            facebookUrl, instagramUrl, tiktokUrl, whatsappUrl
        });
    },

    /** 
     * Añade una nueva sucursal física al listado del footer.
     * @param {Object} params - Datos de la sucursal.
     * @param {string} params.name - Nombre de la sucursal.
     * @param {string} params.address - Dirección de la sucursal.
     * @returns {Promise<void>}
     */
    async addBranch({ name, address }) {
        await footerRepository.addBranch({ name, address });
    },

    /** 
     * Elimina una sucursal del pie de página por su ID.
     * @param {number} id - ID de la sucursal.
     * @returns {Promise<void>}
     */
    async deleteBranch(id) {
        await footerRepository.deleteBranch(id);
    }
};
