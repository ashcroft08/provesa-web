import { auth } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';

export const load = async (event) => {
    const token = event.url.searchParams.get('token');

    if (!token) {
        throw redirect(302, '/login');
    }

    return {
        token
    };
};

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const password = formData.get('password')?.toString();
        const confirmPassword = formData.get('confirmPassword')?.toString();
        const token = event.url.searchParams.get('token');

        if (!password || !confirmPassword) {
            return fail(400, { error: 'Debes completar ambos campos.' });
        }

        if (password !== confirmPassword) {
            return fail(400, { error: 'Las contraseñas no coinciden.' });
        }

        // Validaciones de seguridad robustas (reflejo de la UI)
        const hasUpper = /[A-Z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[^A-Za-z0-9]/.test(password);
        const isLongEnough = password.length >= 8;

        if (!isLongEnough || !hasUpper || !hasNumber || !hasSpecial) {
            return fail(400, {
                error: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.'
            });
        }

        if (!token) {
            return fail(400, { error: 'Token inválido o expirado.' });
        }

        try {
            await auth.api.resetPassword({
                body: {
                    newPassword: password,
                    token: token
                }
            });

            return { success: true };
        } catch (error) {
            const { translateError } = await import('$lib/utils/auth-errors');
            return fail(400, { error: translateError(error) });
        }
    }
};
