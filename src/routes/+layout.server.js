import { footerRepository } from '$lib/server/repositories/footer.repository.js';
import { siteConfigRepository } from '$lib/server/repositories/site-config.repository.js';

export const load = async () => {
    const [info, branches, siteConfigData] = await Promise.all([
        footerRepository.getInfo(),
        footerRepository.getBranches(),
        siteConfigRepository.getAll()
    ]);

    return {
        footer: {
            info: info || null,
            branches
        },
        siteConfig: siteConfigData
    };
};
