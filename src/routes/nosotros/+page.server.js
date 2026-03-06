import { db } from '$lib/server/db';
import { nosotrosPage } from '$lib/server/db/schema';

export const load = async () => {
    const [page] = await db.select().from(nosotrosPage).limit(1);
    return {
        nosotrosPage: page || null
    };
};
