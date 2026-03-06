import { fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { postulaciones, empleoSucursales } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import cloudinary from '$lib/server/cloudinary.js';

export const load = async () => {
    const sucursales = await db
        .select()
        .from(empleoSucursales)
        .where(eq(empleoSucursales.activa, true));

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

        let cvUrl = null;

        // Subir CV a Cloudinary si se proporcionó
        if (cvFile && cvFile instanceof File && cvFile.size > 0) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(cvFile.type)) {
                return fail(400, { error: 'Formato no soportado. Usa PDF, JPG, PNG o WebP.', nombre, telefono, email, sucursal, mensaje });
            }
            if (cvFile.size > 5 * 1024 * 1024) {
                return fail(400, { error: 'El archivo no puede pesar más de 5MB.', nombre, telefono, email, sucursal, mensaje });
            }

            try {
                const buffer = Buffer.from(await cvFile.arrayBuffer());
                const base64 = `data:${cvFile.type};base64,${buffer.toString('base64')}`;
                const result = await cloudinary.uploader.upload(base64, {
                    folder: 'provesa-web/postulaciones',
                    resource_type: 'auto'
                });
                cvUrl = result.secure_url;
            } catch (e) {
                console.error('Error subiendo CV a Cloudinary:', e);
                return fail(500, { error: 'Error al subir el archivo. Inténtelo de nuevo.', nombre, telefono, email, sucursal, mensaje });
            }
        }

        try {
            await db.insert(postulaciones).values({
                nombre,
                telefono,
                email,
                sucursal,
                cvUrl,
                mensaje
            });

            return { success: true };
        } catch (e) {
            console.error('Error guardando postulación:', e);
            return fail(500, { error: 'Error al enviar la postulación. Inténtelo de nuevo.' });
        }
    }
};
