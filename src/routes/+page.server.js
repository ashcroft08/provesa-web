import { db } from '$lib/server/db';
import { heroSlides, products } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
    const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    const productsList = await db.select().from(products).orderBy(asc(products.sortOrder));
    return { slides, products: productsList };
};
