import { footerRepository } from '../repositories/footer.repository.js';

export const footerService = {
    /** Obtiene toda la data del footer (info + sucursales) */
    async getFooterData() {
        const [info, branches] = await Promise.all([
            footerRepository.getInfo(),
            footerRepository.getBranches()
        ]);
        return { info, branches };
    },

    /** Actualiza la información general del footer */
    async updateFooterInfo({ description, address, phone, mobile, email, facebookUrl, instagramUrl, tiktokUrl, whatsappUrl }) {
        await footerRepository.upsertInfo({
            description, address, phone, mobile, email,
            facebookUrl, instagramUrl, tiktokUrl, whatsappUrl
        });
    },

    /** Agrega una nueva sucursal */
    async addBranch({ name, address }) {
        await footerRepository.addBranch({ name, address });
    },

    /** Elimina una sucursal por ID */
    async deleteBranch(id) {
        await footerRepository.deleteBranch(id);
    }
};
