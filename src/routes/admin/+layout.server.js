import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
    // Obtenemos el usuario que los hooks ya validaron
    const { user } = event.locals;

    // Si no hay sesión iniciada, lo expulsamos al login
    if (!user) {
        throw redirect(302, '/login');
    }

    // Si llega aquí, es porque está logueado. 
    // Podemos pasar el usuario a todas las sub-páginas del admin
    return {
        user
    };
};
