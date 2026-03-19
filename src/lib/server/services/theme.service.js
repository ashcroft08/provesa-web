import fs from 'fs';
import path from 'path';
import { siteConfigRepository } from '../repositories/site-config.repository.js';

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
                background: content.match(/--color-background:\s*(#[a-fA-F0-9]{6})/)?.[1] || '#ffffff',
                navbarHover: content.match(/--color-navbar-hover:\s*(#[a-fA-F0-9]{6}|var\(--color-primary\))/)?.[1] || 'var(--color-primary)'
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
    /** @param {{ primary?: string, secondary?: string, accent?: string, background?: string, navbarHover?: string }} colors */
    updateThemeColors({ primary, secondary, accent, background, navbarHover }) {
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
            if (navbarHover) {
                content = content.replace(/(--color-navbar-hover:\s*).+?;/, `$1${navbarHover};`);
            }

            fs.writeFileSync(CSS_PATH, content);

            // Sincronizar con la base de datos (site_config)
            this.syncToDb({ primary, secondary, accent, background, navbarHover });
        } catch (e) {
            console.error('Error escribiendo en layout.css:', e);
            throw new Error('No se pudieron guardar los colores.');
        }
    },

    /** Sincroniza los colores con site_config para persistencia en BD */
    async syncToDb({ primary, secondary, accent, background, navbarHover }) {
        try {
            if (primary) await siteConfigRepository.upsert('theme_primary', primary);
            if (secondary) await siteConfigRepository.upsert('theme_secondary', secondary);
            if (accent) await siteConfigRepository.upsert('theme_accent', accent);
            if (background) await siteConfigRepository.upsert('theme_background', background);
            if (navbarHover) await siteConfigRepository.upsert('theme_navbar_hover', navbarHover);
        } catch (e) {
            console.error('Error sincronizando tema con BD:', e);
        }
    }
};
