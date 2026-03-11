import { fail } from '@sveltejs/kit';
import { empleoService } from '$lib/server/services/empleo.service.js';
import { postulacionesService } from '$lib/server/services/postulaciones.service.js';

export const load = async () => {
    const sucursales = await empleoService.getActive();
    return { sucursales };
};

export const actions = {
    default: async ({ request }) => {
        const formData = await request.formData();
        const nombre = formData.get('nombre')?.toString().trim();
        const telefono = formData.get('telefono')?.toString().trim();
        const email = formData.get('email')?.toString().trim();
        const sucursal = formData.get('sucursal')?.toString().trim();
        const mensaje = formData.get('mensaje')?.toString().trim() || null;
        const cvFile = formData.get('cv');

        if (!nombre || !telefono || !email || !sucursal) {
            return fail(400, { error: 'Todos los campos obligatorios deben ser completados.', nombre, telefono, email, sucursal, mensaje });
        }

        // Validar CV si se proporciona
        if (cvFile && cvFile instanceof File && cvFile.size > 0) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(cvFile.type)) {
                return fail(400, { error: 'Formato no soportado. Usa PDF, JPG, PNG o WebP.', nombre, telefono, email, sucursal, mensaje });
            }
            if (cvFile.size > 5 * 1024 * 1024) {
                return fail(400, { error: 'El archivo no puede pesar más de 5MB.', nombre, telefono, email, sucursal, mensaje });
            }
        }

        try {
            await postulacionesService.create(
                { nombre, telefono, email, sucursal, mensaje },
                cvFile instanceof File && cvFile.size > 0 ? cvFile : null
            );
            return { success: true };
        } catch (e) {
            console.error('Error guardando postulación:', e);
            return fail(500, { error: 'Error al enviar la postulación. Inténtelo de nuevo.' });
        }
    }
};
