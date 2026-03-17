import { auth } from '$lib/server/auth';
import { redirect, fail } from '@sveltejs/kit';

export const load = async (event) => {
    // Si el usuario ya está logueado, lo mandamos al inicio
    if (event.locals.user) {
        throw redirect(302, '/admin');
    }
    return {};
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email')?.toString();
        const password = formData.get('password')?.toString();

        if (!email || !password) {
            return fail(400, { error: 'Email y contraseña son requeridos' });
        }

        try {
            await auth.api.signInEmail({
                body: {
                    email,
                    password
                }
            });
        } catch (error) {
            console.error('[Login Error]:', error);
            const { translateError } = await import('$lib/utils/auth-errors');
            return fail(400, {
                email,
                error: translateError(error)
            });
        }

        throw redirect(303, '/admin');
    }
};