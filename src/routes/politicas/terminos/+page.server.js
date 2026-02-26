import { db } from '$lib/server/db';
import { legalPages } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';

export const load = async () => {
    const [page] = await db.select().from(legalPages).where(eq(legalPages.slug, 'terminos'));
    return {
        legalPage: page || null
    };
};
