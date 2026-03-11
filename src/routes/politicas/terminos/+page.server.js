import { legalRepository } from '$lib/server/repositories/legal.repository.js';

export const load = async () => {
    const page = await legalRepository.getBySlug('terminos');
    return {
        legalPage: page || null
    };
};
