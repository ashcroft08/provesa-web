import { concursosService } from '$lib/server/services/concursos.service.js';

export const load = async () => {
    const { concurso, ganadores } = await concursosService.getPublicData();
    return { concurso, ganadores };
};
