import { slidesService } from '$lib/server/services/slides.service.js';
import { productsService } from '$lib/server/services/products.service.js';
import { nosotrosService } from '$lib/server/services/nosotros.service.js';
import { sugerenciasService } from '$lib/server/services/sugerencias.service.js';
import { footerRepository } from '$lib/server/repositories/footer.repository.js';
import { fail } from '@sveltejs/kit';

export const load = async () => {
    const [slides, productsList, nosotros, sugConfig, footer] = await Promise.all([
        slidesService.getAllSlides(),
        productsService.getAllProducts(),
        nosotrosService.getConfig(),
        sugerenciasService.getConfig(),
        footerRepository.getInfo()
    ]);

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
            await sugerenciasService.create({ tipo, nombre, mensaje });
            return { success: true };
        } catch (e) {
            console.error('Error guardando sugerencia:', e);
            return fail(500, { error: 'No se pudo enviar su mensaje. Intente más tarde.' });
        }
    }
};
