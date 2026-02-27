import { db } from '$lib/server/db';
import { heroSlides, products, nosotrosConfig, sugerencias, sugerenciasConfig, footerInfo } from '$lib/server/db/schema';
import { asc } from 'drizzle-orm';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const slides = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
    const productsList = await db.select().from(products).orderBy(asc(products.sortOrder));
    const [nosotros] = await db.select().from(nosotrosConfig).limit(1);
    const [sugConfig] = await db.select().from(sugerenciasConfig).limit(1);
    const [footer] = await db.select().from(footerInfo).limit(1);

    return {
        slides,
        products: productsList,
        nosotros: nosotros || null,
        sugOptions: sugConfig?.opciones || ['Sugerencia de Servicio', 'Nuevo Producto Requerido', 'Reclamo', 'Felicitación'],
        footer: footer || null
    };
};

export const actions = {
    enviarSugerencia: async ({ request }) => {
        const formData = await request.formData();
        const tipo = formData.get('tipo')?.toString();
        const nombre = formData.get('nombre')?.toString() || 'Anónimo';
        const mensaje = formData.get('mensaje')?.toString();

        if (!tipo || !mensaje) {
            return fail(400, { error: 'Mensaje y tipo son requeridos.' });
        }

        try {
            await db.insert(sugerencias).values({
                tipo,
                nombre,
                mensaje
            });
            return { success: true };
        } catch (e) {
            console.error('Error guardando sugerencia:', e);
            return fail(500, { error: 'No se pudo enviar su mensaje. Intente más tarde.' });
        }
    }
};
