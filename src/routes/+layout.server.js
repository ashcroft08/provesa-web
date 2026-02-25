import { db } from '$lib/server/db';
import { footerInfo, footerBranches } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
    const [info] = await db.select().from(footerInfo).limit(1);
    const branches = await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));

    return {
        footer: {
            info: info || null,
            branches
        }
    };
};
