import { json } from '@sveltejs/kit';
import { uploadRepository } from '$lib/server/repositories/upload.repository.js';

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

        const result = await uploadRepository.uploadImage(file, {
            folder: 'provesa-web',
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
