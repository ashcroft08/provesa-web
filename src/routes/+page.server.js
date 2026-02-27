import { db } from '$lib/server/db';
import { heroSlides, products, nosotrosConfig } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';

export const load = async () => {
    const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    const productsList = await db.select().from(products).orderBy(asc(products.sortOrder));
    const [nosotros] = await db.select().from(nosotrosConfig).limit(1);
    return { slides, products: productsList, nosotros: nosotros || null };
};
