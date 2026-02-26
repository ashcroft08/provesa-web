import { db } from '$lib/server/db';
import { heroSlides } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
    const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    return { slides };
};
