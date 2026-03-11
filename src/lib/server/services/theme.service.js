import fs from 'fs';
import path from 'path';

// Ruta al archivo de estilos donde están los colores
const CSS_PATH = path.resolve('src/routes/layout.css');

export const themeService = {
    /** Lee los colores actuales del archivo CSS usando expresiones regulares */
    getThemeColors() {
        try {
            const content = fs.readFileSync(CSS_PATH, 'utf-8');
            return {
                primary: content.match(/--color-primary:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#455dd9',
                secondary: content.match(/--color-secondary:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#ffd100',
                accent: content.match(/--color-accent:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#e4002b',
                background: content.match(/--color-background:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#ffffff'
            };
        } catch (e) {
            console.error('Error leyendo layout.css:', e);
            return { primary: '#455dd9', secondary: '#ffd100', accent: '#e4002b', background: '#ffffff' };
        }
    },

    /**
     * Actualiza los colores en el archivo CSS.
     * Sincroniza automáticamente los aliases:
     *   --color-accent-red    ← sigue a accent
     *   --color-accent-yellow ← sigue a secondary
     */
    updateThemeColors({ primary, secondary, accent, background }) {
        try {
            let content = fs.readFileSync(CSS_PATH, 'utf-8');

            if (primary) {
                content = content.replace(/(--color-primary:\s*).+?;/, `$1${primary};`);
            }
            if (secondary) {
                content = content.replace(/(--color-secondary:\s*).+?;/, `$1${secondary};`);
                // Sincronizar alias accent-yellow con secondary
                content = content.replace(/(--color-accent-yellow:\s*).+?;/, `$1${secondary};`);
            }
            if (accent) {
                content = content.replace(/(--color-accent:\s*).+?;/, `$1${accent};`);
                // Sincronizar alias accent-red con accent
                content = content.replace(/(--color-accent-red:\s*).+?;/, `$1${accent};`);
            }
            if (background) {
                content = content.replace(/(--color-background:\s*).+?;/, `$1${background};`);
            }

            fs.writeFileSync(CSS_PATH, content);
        } catch (e) {
            console.error('Error escribiendo en layout.css:', e);
            throw new Error('No se pudieron guardar los colores.');
        }
    }
};
