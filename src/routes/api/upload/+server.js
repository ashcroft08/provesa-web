import { json, fail } from '@sveltejs/kit';
import cloudinary from '$lib/server/cloudinary.js';

export const POST = async ({ request, locals }) => {
    if (!locals.session) {
        return json({ error: 'No autorizado' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || !(file instanceof File)) {
            return json({ error: 'No se proporcionó una imagen válida.' }, { status: 400 });
        }

        // Validar tipo de archivo
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return json({ error: 'Formato no soportado. Usa JPG, PNG, WebP o GIF.' }, { status: 400 });
        }

        // Validar tamaño (máx 10MB)
        if (file.size > 10 * 1024 * 1024) {
            return json({ error: 'La imagen no puede pesar más de 10MB.' }, { status: 400 });
        }

        // Convertir a base64 para Cloudinary
        const buffer = Buffer.from(await file.arrayBuffer());
        const base64 = `data:${file.type};base64,${buffer.toString('base64')}`;

        // Subir a Cloudinary
        const result = await cloudinary.uploader.upload(base64, {
            folder: 'provesa-web',
            resource_type: 'image',
            transformation: [
                { quality: 'auto:good', fetch_format: 'auto' }
            ]
        });

        return json({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height
        });
    } catch (e) {
        console.error('Error subiendo imagen a Cloudinary:', e);
        return json({ error: 'Error al subir la imagen.' }, { status: 500 });
    }
};
