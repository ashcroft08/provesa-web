import { redirect, fail } from '@sveltejs/kit';
import { themeService } from '$lib/server/services/theme.service.js';
import { footerService } from '$lib/server/services/footer.service.js';
import { legalService } from '$lib/server/services/legal.service.js';
import { slidesService } from '$lib/server/services/slides.service.js';
import { productsService } from '$lib/server/services/products.service.js';
import { nosotrosService } from '$lib/server/services/nosotros.service.js';
import { sugerenciasService } from '$lib/server/services/sugerencias.service.js';
import { postulacionesService } from '$lib/server/services/postulaciones.service.js';
import { empleoService } from '$lib/server/services/empleo.service.js';
import { siteConfigService } from '$lib/server/services/site-config.service.js';
import { concursosService } from '$lib/server/services/concursos.service.js';

export const load = async (event) => {
    if (!event.locals.session) {
        throw redirect(302, '/login');
    }

    const [footer, legal, slides, products, nosotros, nosotrosPageData, sugerencias, sugerenciasConfig, postulaciones, empleoSucursales, siteConfig, concursosList, ganadoresList] =
        await Promise.all([
            footerService.getFooterData(),
            legalService.getLegalPages(),
            slidesService.getAllSlides(),
            productsService.getAllProducts(),
            nosotrosService.getConfig(),
            nosotrosService.getPage(),
            sugerenciasService.getAll(),
            sugerenciasService.getConfig(),
            postulacionesService.getAll(),
            empleoService.getAll(),
            siteConfigService.getConfigMap(),
            concursosService.getAllConcursos(),
            concursosService.getAllGanadores()
        ]);

    return {
        user: event.locals.user,
        theme: themeService.getThemeColors(),
        footer,
        legal,
        slides,
        products,
        nosotros,
        nosotrosPageData,
        sugerencias,
        sugerenciasConfig,
        postulaciones,
        empleoSucursales,
        siteConfig,
        concursosList,
        ganadoresList
    };
};

export const actions = {
    updateTheme: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            themeService.updateThemeColors({
                primary: formData.get('primary')?.toString(),
                secondary: formData.get('secondary')?.toString(),
                accent: formData.get('accent')?.toString(),
                background: formData.get('background')?.toString()
            });
            return { success: true };
        } catch (e) {
            return fail(500, { error: 'No se pudieron guardar los colores.' });
        }
    },

    updateFooter: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await footerService.updateFooterInfo({
                description: formData.get('description')?.toString() || '',
                address: formData.get('address')?.toString() || '',
                phone: formData.get('phone')?.toString() || '',
                mobile: formData.get('mobile')?.toString() || '',
                email: formData.get('email')?.toString() || '',
                facebookUrl: formData.get('facebookUrl')?.toString() || '',
                instagramUrl: formData.get('instagramUrl')?.toString() || '',
                tiktokUrl: formData.get('tiktokUrl')?.toString() || '',
                whatsappUrl: formData.get('whatsappUrl')?.toString() || ''
            });
            return { footerSuccess: true };
        } catch (e) {
            console.error('Error guardando footer:', e);
            return fail(500, { error: 'No se pudo guardar la información del footer.' });
        }
    },

    addBranch: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const name = formData.get('branchName')?.toString();
        if (!name) return fail(400, { error: 'El nombre de la sucursal es requerido.' });
        try {
            await footerService.addBranch({ name, address: formData.get('branchAddress')?.toString() || '' });
            return { branchAdded: true };
        } catch (e) {
            console.error('Error agregando sucursal:', e);
            return fail(500, { error: 'No se pudo agregar la sucursal.' });
        }
    },

    deleteBranch: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('branchId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de sucursal inválido.' });
        try {
            await footerService.deleteBranch(id);
            return { branchDeleted: true };
        } catch (e) {
            console.error('Error eliminando sucursal:', e);
            return fail(500, { error: 'No se pudo eliminar la sucursal.' });
        }
    },

    updateLegalPage: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const slug = formData.get('slug')?.toString();
        if (!slug) return fail(400, { error: 'Slug es requerido.' });
        try {
            await legalService.updateLegalPage(slug, {
                title: formData.get('title')?.toString() || '',
                content: formData.get('content')?.toString() || ''
            });
            return { legalSuccess: true, savedSlug: slug };
        } catch (e) {
            console.error('Error guardando página legal:', e);
            return fail(500, { error: 'No se pudo guardar la página.' });
        }
    },

    addSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const imageUrl = formData.get('imageUrl')?.toString() || '';
        if (!imageUrl) return fail(400, { error: 'La URL de la imagen es requerida.' });
        try {
            await slidesService.addSlide({
                imageUrl,
                title: formData.get('title')?.toString() || '',
                highlight: formData.get('highlight')?.toString() || '',
                description: formData.get('description')?.toString() || '',
                badge: formData.get('badge')?.toString() || '',
                align: formData.get('align')?.toString() || 'left',
                highlightColor: formData.get('highlightColor')?.toString() || 'text-accent-yellow'
            });
            return { slideAdded: true };
        } catch (e) {
            console.error('Error agregando slide:', e);
            return fail(500, { error: 'No se pudo agregar el slide.' });
        }
    },

    updateSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('slideId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de slide inválido.' });
        try {
            await slidesService.updateSlide(id, {
                imageUrl: formData.get('imageUrl')?.toString() || '',
                title: formData.get('title')?.toString() || '',
                highlight: formData.get('highlight')?.toString() || '',
                description: formData.get('description')?.toString() || '',
                badge: formData.get('badge')?.toString() || '',
                align: formData.get('align')?.toString() || 'left',
                highlightColor: formData.get('highlightColor')?.toString() || 'text-accent-yellow'
            });
            return { slideUpdated: true };
        } catch (e) {
            console.error('Error actualizando slide:', e);
            return fail(500, { error: 'No se pudo actualizar el slide.' });
        }
    },

    deleteSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('slideId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de slide inválido.' });
        try {
            await slidesService.deleteSlide(id);
            return { slideDeleted: true };
        } catch (e) {
            console.error('Error eliminando slide:', e);
            return fail(500, { error: 'No se pudo eliminar el slide.' });
        }
    },

    addProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const name = formData.get('name')?.toString() || '';
        if (!name) return fail(400, { error: 'El nombre del producto es requerido.' });
        try {
            await productsService.addProduct({
                name,
                description: formData.get('description')?.toString() || '',
                align: formData.get('align')?.toString() || 'left',
                accentColor: formData.get('accentColor')?.toString() || 'primary',
                displayType: formData.get('displayType')?.toString() || 'features',
                images: formData.get('images')?.toString() || '[]',
                features: formData.get('features')?.toString() || '[]',
                categories: formData.get('categories')?.toString() || '[]'
            });
            return { productAdded: true };
        } catch (e) {
            console.error('Error agregando producto:', e);
            return fail(500, { error: 'No se pudo agregar el producto.' });
        }
    },

    updateProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('productId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de producto inválido.' });
        try {
            await productsService.updateProduct(id, {
                name: formData.get('name')?.toString() || '',
                description: formData.get('description')?.toString() || '',
                align: formData.get('align')?.toString() || 'left',
                accentColor: formData.get('accentColor')?.toString() || 'primary',
                displayType: formData.get('displayType')?.toString() || 'features',
                images: formData.get('images')?.toString() || '[]',
                features: formData.get('features')?.toString() || '[]',
                categories: formData.get('categories')?.toString() || '[]'
            });
            return { productUpdated: true };
        } catch (e) {
            console.error('Error actualizando producto:', e);
            return fail(500, { error: 'No se pudo actualizar el producto.' });
        }
    },

    deleteProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('productId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de producto inválido.' });
        try {
            await productsService.deleteProduct(id);
            return { productDeleted: true };
        } catch (e) {
            console.error('Error eliminando producto:', e);
            return fail(500, { error: 'No se pudo eliminar el producto.' });
        }
    },

    updateNosotros: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await nosotrosService.updateConfig({
                badge: formData.get('badge')?.toString() || 'Nuestra Esencia',
                title: formData.get('title')?.toString() || '',
                titleHighlight: formData.get('titleHighlight')?.toString() || '',
                description: formData.get('description')?.toString() || '',
                ctaText: formData.get('ctaText')?.toString() || 'Conocer Más',
                ctaLink: formData.get('ctaLink')?.toString() || '/nosotros',
                colors: formData.get('colors')?.toString() || '{}',
                stats: formData.get('stats')?.toString() || '[]'
            });
            return { nosotrosUpdated: true };
        } catch (e) {
            console.error('Error actualizando nosotros config:', e);
            return fail(500, { error: 'No se pudo guardar la configuración.' });
        }
    },

    updateNosotrosPage: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await nosotrosService.updatePage({
                heroBadge: formData.get('heroBadge')?.toString() || 'Desde 2006',
                heroTitle: formData.get('heroTitle')?.toString() || '',
                heroDescription: formData.get('heroDescription')?.toString() || '',
                historyTitle: formData.get('historyTitle')?.toString() || '',
                historyParagraphs: formData.get('historyParagraphs')?.toString() || '[]',
                historyImageUrl: formData.get('historyImageUrl')?.toString() || '',
                missionTitle: formData.get('missionTitle')?.toString() || '',
                missionText: formData.get('missionText')?.toString() || '',
                visionTitle: formData.get('visionTitle')?.toString() || '',
                visionText: formData.get('visionText')?.toString() || '',
                galleryImages: formData.get('galleryImages')?.toString() || '[]'
            });
            return { nosotrosPageUpdated: true };
        } catch (e) {
            console.error('Error actualizando página nosotros:', e);
            return fail(500, { error: 'No se pudo guardar el contenido de la página.' });
        }
    },

    markSugerenciaRead: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400);
        try {
            await sugerenciasService.markAsRead(id);
            return { sugSuccess: true };
        } catch (e) {
            console.error('Error marcando sugerencia como leída:', e);
            return fail(500);
        }
    },

    deleteSugerencia: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400);
        try {
            await sugerenciasService.delete(id);
            return { sugDeleted: true };
        } catch (e) {
            console.error('Error eliminando sugerencia:', e);
            return fail(500);
        }
    },

    updateSugerenciasConfig: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await sugerenciasService.updateConfig(formData.get('opciones')?.toString() || '[]');
            return { configSuccess: true };
        } catch (e) {
            console.error('Error actualizando opciones de sugerencias:', e);
            return fail(500, { error: 'No se pudieron guardar las opciones.' });
        }
    },

    logout: async ({ locals, request }) => {
        if (locals.session) {
            const { auth } = await import('$lib/server/auth');
            await auth.api.signOut({ headers: request.headers });
        }
        throw redirect(302, '/login');
    },

    deletePostulacion: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await postulacionesService.delete(id);
            return { postulacionDeleted: true };
        } catch (e) {
            console.error('Error eliminando postulación:', e);
            return fail(500, { error: 'Error al eliminar' });
        }
    },

    addEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const nombre = formData.get('nombre')?.toString().trim();
        if (!nombre) return fail(400, { error: 'Nombre requerido' });
        try {
            await empleoService.addSucursal(nombre);
            return { sucursalAdded: true };
        } catch (e) {
            console.error('Error agregando sucursal:', e);
            return fail(500, { error: 'Error al agregar sucursal' });
        }
    },

    toggleEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const activa = formData.get('activa') === 'true';
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await empleoService.toggleSucursal(id, activa);
            return { sucursalToggled: true };
        } catch (e) {
            console.error('Error actualizando sucursal:', e);
            return fail(500, { error: 'Error al actualizar' });
        }
    },

    deleteEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await empleoService.deleteSucursal(id);
            return { sucursalDeleted: true };
        } catch (e) {
            console.error('Error eliminando sucursal:', e);
            return fail(500, { error: 'Error al eliminar' });
        }
    },

    updateLogo: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const logoFile = formData.get('logo');

        if (!logoFile || !(logoFile instanceof File) || logoFile.size === 0) {
            return fail(400, { error: 'Debes seleccionar un archivo' });
        }

        const allowedTypes = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'];
        if (!allowedTypes.includes(logoFile.type)) {
            return fail(400, { error: 'Formato no soportado. Usa PNG, JPG, WebP o SVG.' });
        }

        if (logoFile.size > 2 * 1024 * 1024) {
            return fail(400, { error: 'El archivo no puede pesar más de 2MB.' });
        }

        try {
            await siteConfigService.updateLogo(logoFile);
            return { logoUpdated: true };
        } catch (e) {
            console.error('Error subiendo logo:', e);
            return fail(500, { error: 'Error al subir el logo' });
        }
    },

    // ─── Concursos ───

    addConcurso: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await concursosService.addConcurso(formData);
            return { concursoAdded: true };
        } catch (e) {
            console.error('Error creando concurso:', e);
            return fail(500, { error: 'Error al crear el concurso' });
        }
    },

    updateConcurso: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        try {
            await concursosService.updateConcurso(id, formData);
            return { concursoUpdated: true };
        } catch (e) {
            console.error('Error actualizando concurso:', e);
            return fail(500, { error: 'Error al actualizar el concurso' });
        }
    },

    deleteConcurso: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        try {
            await concursosService.deleteConcurso(id);
            return { concursoDeleted: true };
        } catch (e) {
            console.error('Error eliminando concurso:', e);
            return fail(500, { error: 'Error al eliminar el concurso' });
        }
    },

    // ─── Ganadores ───

    addGanador: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        try {
            await concursosService.addGanador(formData);
            return { ganadorAdded: true };
        } catch (e) {
            console.error('Error creando ganador:', e);
            return fail(500, { error: 'Error al crear el ganador' });
        }
    },

    updateGanador: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        try {
            await concursosService.updateGanador(id, formData);
            return { ganadorUpdated: true };
        } catch (e) {
            console.error('Error actualizando ganador:', e);
            return fail(500, { error: 'Error al actualizar el ganador' });
        }
    },

    deleteGanador: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = parseInt(formData.get('id'));
        try {
            await concursosService.deleteGanador(id);
            return { ganadorDeleted: true };
        } catch (e) {
            console.error('Error eliminando ganador:', e);
            return fail(500, { error: 'Error al eliminar el ganador' });
        }
    }
};
