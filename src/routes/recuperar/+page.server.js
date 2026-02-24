import { auth } from '$lib/server/auth';
import { fail } from '@sveltejs/kit';

export const actions = {
    default: async (event) => {
        const formData = await event.request.formData();
        const email = formData.get('email')?.toString();

        if (!email) {
            return fail(400, { error: 'El correo electrónico es requerido' });
        }

        try {
            await auth.api.requestPasswordReset({
                body: {
                    email,
                    redirectTo: '/restablecer-password'
                }
            });

            return { success: true };
        } catch (error) {
            const { translateError } = await import('$lib/utils/auth-errors');
            return fail(400, { error: translateError(error) });
        }
    }
};
