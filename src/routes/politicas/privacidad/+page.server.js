import { legalRepository } from '$lib/server/repositories/legal.repository.js';

export const load = async () => {
    const page = await legalRepository.getBySlug('privacidad');
    return {
        legalPage: page || null
    };
};
