import { footerRepository } from '$lib/server/repositories/footer.repository.js';
import { siteConfigRepository } from '$lib/server/repositories/site-config.repository.js';
import { themeService } from '$lib/server/services/theme.service.js';

export const load = async () => {
    const [info, branches, siteConfigData, theme] = await Promise.all([
        footerRepository.getInfo(),
        footerRepository.getBranches(),
        siteConfigRepository.getAll(),
        themeService.getThemeColors()
    ]);

    return {
        footer: {
            info: info || null,
            branches
        },
        siteConfig: siteConfigData,
        theme
    };
};
