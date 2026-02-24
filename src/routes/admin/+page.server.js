import { redirect, fail } from '@sveltejs/kit';
import fs from 'fs';
import path from 'path';

// Ruta al archivo de estilos donde están los colores
const CSS_PATH = path.resolve('src/routes/layout.css');

/**
 * Lee los colores actuales del archivo CSS usando expresiones regulares
 */
function getThemeColors() {
    try {
        const content = fs.readFileSync(CSS_PATH, 'utf-8');
        const colors = {
            primary: content.match(/--color-primary:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#1565C0',
            secondary: content.match(/--color-secondary:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#FFD100',
            accent: content.match(/--color-accent:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#E4002B',
            background: content.match(/--color-background:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#FAFAF7'
        };
        return colors;
    } catch (e) {
        console.error('Error leyendo layout.css:', e);
        return { primary: '#1565C0', secondary: '#FFD100', accent: '#E4002B', background: '#FAFAF7' };
    }
}

export const load = async (event) => {
    // 1. Protección de ruta: Solo administradores logueados
    if (!event.locals.session) {
        throw redirect(302, '/login');
    }

    // 2. Cargar los colores actuales para el editor
    return {
        user: event.locals.user,
        theme: getThemeColors()
    };
};

export const actions = {
    /**
     * Actualiza los colores en el archivo layout.css
     */
    updateTheme: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const primary = formData.get('primary')?.toString();
        const secondary = formData.get('secondary')?.toString();
        const accent = formData.get('accent')?.toString();
        const background = formData.get('background')?.toString();

        try {
            let content = fs.readFileSync(CSS_PATH, 'utf-8');

            // Reemplazamos los valores en el archivo usando Regex
            if (primary) content = content.replace(/(--color-primary:\s*).+?;/, `$1${primary};`);
            if (secondary) content = content.replace(/(--color-secondary:\s*).+?;/, `$1${secondary};`);
            if (accent) content = content.replace(/(--color-accent:\s*).+?;/, `$1${accent};`);
            if (background) content = content.replace(/(--color-background:\s*).+?;/, `$1${background};`);

            fs.writeFileSync(CSS_PATH, content);
            return { success: true };
        } catch (e) {
            console.error('Error escribiendo en layout.css:', e);
            return fail(500, { error: 'No se pudieron guardar los colores.' });
        }
    },

    /**
     * Acción para cerrar sesión
     */
    logout: async ({ locals, request }) => {
        if (locals.session) {
            const { auth } = await import('$lib/server/auth');
            await auth.api.signOut({
                headers: request.headers
            });
        }
        throw redirect(302, '/login');
    }
};
