import { nosotrosRepository } from '$lib/server/repositories/nosotros.repository.js';

export const load = async () => {
    const page = await nosotrosRepository.getPage();
    return {
        nosotrosPage: page || null
    };
};
