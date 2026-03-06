import { redirect, fail } from '@sveltejs/kit';
import { db } from '$lib/server/db';
import { footerInfo, footerBranches, legalPages, heroSlides, products, nosotrosConfig, nosotrosPage, sugerencias, sugerenciasConfig, postulaciones, empleoSucursales } from '$lib/server/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
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

/**
 * Obtiene los datos del footer desde la BD
 */
async function getFooterData() {
    const [info] = await db.select().from(footerInfo).limit(1);
    const branches = await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
    return {
        info: info || null,
        branches
    };
}

/**
 * Obtiene las páginas legales desde la BD
 */
async function getLegalPages() {
    const pages = await db.select().from(legalPages);
    const privacidad = pages.find(p => p.slug === 'privacidad') || null;
    const terminos = pages.find(p => p.slug === 'terminos') || null;
    return { privacidad, terminos };
}

/**
 * Obtiene los slides del hero desde la BD
 */
async function getHeroSlides() {
    return await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
}

/**
 * Obtiene los productos de la sección principal
 */
async function getProducts() {
    return await db.select().from(products).orderBy(asc(products.sortOrder));
}

/**
 * Obtiene la configuración de la sección Nosotros (singleton)
 */
async function getNosotrosConfig() {
    const [config] = await db.select().from(nosotrosConfig).limit(1);
    return config || null;
}

/**
 * Obtiene el contenido de la página /nosotros (singleton)
 */
async function getNosotrosPage() {
    const [page] = await db.select().from(nosotrosPage).limit(1);
    return page || null;
}

/**
 * Obtiene todas las sugerencias recibidas (orden descendente por fecha)
 */
async function getSugerencias() {
    return await db.select().from(sugerencias).orderBy(desc(sugerencias.createdAt));
}

/**
 * Obtiene la configuración de sugerencias (opciones del dropdown)
 */
async function getSugerenciasConfig() {
    const [config] = await db.select().from(sugerenciasConfig).limit(1);
    return config || null;
}

/**
 * Obtiene todas las postulaciones (orden descendente por fecha)
 */
async function getPostulaciones() {
    return await db.select().from(postulaciones).orderBy(desc(postulaciones.createdAt));
}

/**
 * Obtiene todas las sucursales de empleo
 */
async function getEmpleoSucursales() {
    return await db.select().from(empleoSucursales).orderBy(asc(empleoSucursales.nombre));
}

export const load = async (event) => {
    if (!event.locals.session) {
        throw redirect(302, '/login');
    }

    const footer = await getFooterData();
    const legal = await getLegalPages();
    const slides = await getHeroSlides();
    const productsList = await getProducts();
    const nosotros = await getNosotrosConfig();
    const nosotrosPageData = await getNosotrosPage();

    return {
        user: event.locals.user,
        theme: getThemeColors(),
        footer,
        legal,
        slides,
        products: productsList,
        nosotros,
        nosotrosPageData,
        sugerencias: await getSugerencias(),
        sugerenciasConfig: await getSugerenciasConfig(),
        postulaciones: await getPostulaciones(),
        empleoSucursales: await getEmpleoSucursales()
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
     * Actualiza la información general del footer (crear o actualizar)
     */
    updateFooter: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const description = formData.get('description')?.toString() || '';
        const address = formData.get('address')?.toString() || '';
        const phone = formData.get('phone')?.toString() || '';
        const mobile = formData.get('mobile')?.toString() || '';
        const email = formData.get('email')?.toString() || '';
        const facebookUrl = formData.get('facebookUrl')?.toString() || '';
        const instagramUrl = formData.get('instagramUrl')?.toString() || '';
        const tiktokUrl = formData.get('tiktokUrl')?.toString() || '';
        const whatsappUrl = formData.get('whatsappUrl')?.toString() || '';

        try {
            const [existing] = await db.select().from(footerInfo).limit(1);

            if (existing) {
                await db.update(footerInfo)
                    .set({
                        description, address, phone, mobile, email,
                        facebookUrl, instagramUrl, tiktokUrl, whatsappUrl,
                        updatedAt: new Date()
                    })
                    .where(eq(footerInfo.id, existing.id));
            } else {
                await db.insert(footerInfo).values({
                    description, address, phone, mobile, email,
                    facebookUrl, instagramUrl, tiktokUrl, whatsappUrl
                });
            }

            return { footerSuccess: true };
        } catch (e) {
            console.error('Error guardando footer:', e);
            return fail(500, { error: 'No se pudo guardar la información del footer.' });
        }
    },

    /**
     * Agrega una nueva sucursal
     */
    addBranch: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const name = formData.get('branchName')?.toString();
        const address = formData.get('branchAddress')?.toString() || '';

        if (!name) return fail(400, { error: 'El nombre de la sucursal es requerido.' });

        try {
            // Obtener el mayor sortOrder para poner la nueva al final
            const branches = await db.select().from(footerBranches).orderBy(asc(footerBranches.sortOrder));
            const nextOrder = branches.length > 0 ? branches[branches.length - 1].sortOrder + 1 : 0;

            await db.insert(footerBranches).values({ name, address, sortOrder: nextOrder });
            return { branchAdded: true };
        } catch (e) {
            console.error('Error agregando sucursal:', e);
            return fail(500, { error: 'No se pudo agregar la sucursal.' });
        }
    },

    /**
     * Elimina una sucursal por ID
     */
    deleteBranch: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const id = parseInt(formData.get('branchId')?.toString() || '0');

        if (!id) return fail(400, { error: 'ID de sucursal inválido.' });

        try {
            await db.delete(footerBranches).where(eq(footerBranches.id, id));
            return { branchDeleted: true };
        } catch (e) {
            console.error('Error eliminando sucursal:', e);
            return fail(500, { error: 'No se pudo eliminar la sucursal.' });
        }
    },

    /**
     * Actualiza una página legal (crear o actualizar por slug)
     */
    updateLegalPage: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const slug = formData.get('slug')?.toString();
        const title = formData.get('title')?.toString() || '';
        const content = formData.get('content')?.toString() || '';

        if (!slug) return fail(400, { error: 'Slug es requerido.' });

        try {
            const [existing] = await db.select().from(legalPages).where(eq(legalPages.slug, slug));

            if (existing) {
                await db.update(legalPages)
                    .set({ title, content, updatedAt: new Date() })
                    .where(eq(legalPages.id, existing.id));
            } else {
                await db.insert(legalPages).values({ slug, title, content });
            }

            return { legalSuccess: true, savedSlug: slug };
        } catch (e) {
            console.error('Error guardando página legal:', e);
            return fail(500, { error: 'No se pudo guardar la página.' });
        }
    },

    /**
     * Agrega un nuevo slide al hero
     */
    addSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const imageUrl = formData.get('imageUrl')?.toString() || '';
        const title = formData.get('title')?.toString() || '';
        const highlight = formData.get('highlight')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const badge = formData.get('badge')?.toString() || '';
        const align = formData.get('align')?.toString() || 'left';
        const highlightColor = formData.get('highlightColor')?.toString() || 'text-accent-yellow';

        if (!imageUrl) return fail(400, { error: 'La URL de la imagen es requerida.' });

        try {
            const existing = await db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
            const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

            await db.insert(heroSlides).values({
                imageUrl, title, highlight, description, badge, align, highlightColor, sortOrder: nextOrder
            });
            return { slideAdded: true };
        } catch (e) {
            console.error('Error agregando slide:', e);
            return fail(500, { error: 'No se pudo agregar el slide.' });
        }
    },

    /**
     * Actualiza un slide existente
     */
    updateSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const id = parseInt(formData.get('slideId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de slide inválido.' });

        const imageUrl = formData.get('imageUrl')?.toString() || '';
        const title = formData.get('title')?.toString() || '';
        const highlight = formData.get('highlight')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const badge = formData.get('badge')?.toString() || '';
        const align = formData.get('align')?.toString() || 'left';
        const highlightColor = formData.get('highlightColor')?.toString() || 'text-accent-yellow';

        try {
            await db.update(heroSlides)
                .set({ imageUrl, title, highlight, description, badge, align, highlightColor })
                .where(eq(heroSlides.id, id));
            return { slideUpdated: true };
        } catch (e) {
            console.error('Error actualizando slide:', e);
            return fail(500, { error: 'No se pudo actualizar el slide.' });
        }
    },

    /**
     * Elimina un slide por ID
     */
    deleteSlide: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const id = parseInt(formData.get('slideId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de slide inválido.' });

        try {
            await db.delete(heroSlides).where(eq(heroSlides.id, id));
            return { slideDeleted: true };
        } catch (e) {
            console.error('Error eliminando slide:', e);
            return fail(500, { error: 'No se pudo eliminar el slide.' });
        }
    },

    /**
     * Agrega un nuevo producto
     */
    addProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const name = formData.get('name')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const align = formData.get('align')?.toString() || 'left';
        const accentColor = formData.get('accentColor')?.toString() || 'primary';
        const displayType = formData.get('displayType')?.toString() || 'features';
        const imagesRaw = formData.get('images')?.toString() || '[]';
        const featuresRaw = formData.get('features')?.toString() || '[]';
        const categoriesRaw = formData.get('categories')?.toString() || '[]';

        if (!name) return fail(400, { error: 'El nombre del producto es requerido.' });

        try {
            const existing = await db.select().from(products).orderBy(asc(products.sortOrder));
            const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

            await db.insert(products).values({
                name, description, align, accentColor, displayType,
                images: JSON.parse(imagesRaw),
                features: JSON.parse(featuresRaw),
                categories: JSON.parse(categoriesRaw),
                sortOrder: nextOrder
            });
            return { productAdded: true };
        } catch (e) {
            console.error('Error agregando producto:', e);
            return fail(500, { error: 'No se pudo agregar el producto.' });
        }
    },

    /**
     * Actualiza un producto existente
     */
    updateProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const id = parseInt(formData.get('productId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de producto inválido.' });

        const name = formData.get('name')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const align = formData.get('align')?.toString() || 'left';
        const accentColor = formData.get('accentColor')?.toString() || 'primary';
        const displayType = formData.get('displayType')?.toString() || 'features';
        const imagesRaw = formData.get('images')?.toString() || '[]';
        const featuresRaw = formData.get('features')?.toString() || '[]';
        const categoriesRaw = formData.get('categories')?.toString() || '[]';

        try {
            await db.update(products)
                .set({
                    name, description, align, accentColor, displayType,
                    images: JSON.parse(imagesRaw),
                    features: JSON.parse(featuresRaw),
                    categories: JSON.parse(categoriesRaw)
                })
                .where(eq(products.id, id));
            return { productUpdated: true };
        } catch (e) {
            console.error('Error actualizando producto:', e);
            return fail(500, { error: 'No se pudo actualizar el producto.' });
        }
    },

    /**
     * Elimina un producto
     */
    deleteProduct: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const id = parseInt(formData.get('productId')?.toString() || '0');
        if (!id) return fail(400, { error: 'ID de producto inválido.' });

        try {
            await db.delete(products).where(eq(products.id, id));
            return { productDeleted: true };
        } catch (e) {
            console.error('Error eliminando producto:', e);
            return fail(500, { error: 'No se pudo eliminar el producto.' });
        }
    },

    /**
     * Actualiza la configuración de Nosotros Teaser (upsert singleton)
     */
    updateNosotros: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const badge = formData.get('badge')?.toString() || 'Nuestra Esencia';
        const title = formData.get('title')?.toString() || '';
        const titleHighlight = formData.get('titleHighlight')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        const ctaText = formData.get('ctaText')?.toString() || 'Conocer Más';
        const ctaLink = formData.get('ctaLink')?.toString() || '/nosotros';
        const colorsRaw = formData.get('colors')?.toString() || '{}';
        const statsRaw = formData.get('stats')?.toString() || '[]';

        try {
            const [existing] = await db.select().from(nosotrosConfig).limit(1);
            const data = {
                badge, title, titleHighlight, description, ctaText, ctaLink,
                colors: JSON.parse(colorsRaw),
                stats: JSON.parse(statsRaw),
                updatedAt: new Date()
            };

            if (existing) {
                await db.update(nosotrosConfig).set(data).where(eq(nosotrosConfig.id, existing.id));
            } else {
                await db.insert(nosotrosConfig).values(data);
            }
            return { nosotrosUpdated: true };
        } catch (e) {
            console.error('Error actualizando nosotros config:', e);
            return fail(500, { error: 'No se pudo guardar la configuración.' });
        }
    },

    /**
     * Actualiza el contenido de la página /nosotros (upsert singleton)
     */
    updateNosotrosPage: async ({ request, locals }) => {
        if (!locals.session) return fail(401);

        const formData = await request.formData();
        const heroBadge = formData.get('heroBadge')?.toString() || 'Desde 2006';
        const heroTitle = formData.get('heroTitle')?.toString() || '';
        const heroDescription = formData.get('heroDescription')?.toString() || '';
        const historyTitle = formData.get('historyTitle')?.toString() || '';
        const historyParagraphsRaw = formData.get('historyParagraphs')?.toString() || '[]';
        const historyImageUrl = formData.get('historyImageUrl')?.toString() || '';
        const missionTitle = formData.get('missionTitle')?.toString() || '';
        const missionText = formData.get('missionText')?.toString() || '';
        const visionTitle = formData.get('visionTitle')?.toString() || '';
        const visionText = formData.get('visionText')?.toString() || '';
        const galleryImagesRaw = formData.get('galleryImages')?.toString() || '[]';

        try {
            const [existing] = await db.select().from(nosotrosPage).limit(1);
            const payload = {
                heroBadge, heroTitle, heroDescription,
                historyTitle,
                historyParagraphs: JSON.parse(historyParagraphsRaw),
                historyImageUrl,
                missionTitle, missionText,
                visionTitle, visionText,
                galleryImages: JSON.parse(galleryImagesRaw),
                updatedAt: new Date()
            };

            if (existing) {
                await db.update(nosotrosPage).set(payload).where(eq(nosotrosPage.id, existing.id));
            } else {
                await db.insert(nosotrosPage).values(payload);
            }
            return { nosotrosPageUpdated: true };
        } catch (e) {
            console.error('Error actualizando página nosotros:', e);
            return fail(500, { error: 'No se pudo guardar el contenido de la página.' });
        }
    },

    /**
     * Marca una sugerencia como leída
     */
    markSugerenciaRead: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400);

        try {
            await db.update(sugerencias).set({ leido: true }).where(eq(sugerencias.id, id));
            return { sugSuccess: true };
        } catch (e) {
            console.error('Error marcando sugerencia como leída:', e);
            return fail(500);
        }
    },

    /**
     * Elimina una sugerencia
     */
    deleteSugerencia: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const id = formData.get('id')?.toString();
        if (!id) return fail(400);

        try {
            await db.delete(sugerencias).where(eq(sugerencias.id, id));
            return { sugDeleted: true };
        } catch (e) {
            console.error('Error eliminando sugerencia:', e);
            return fail(500);
        }
    },

    /**
     * Actualiza las opciones del dropdown de sugerencias (upsert singleton)
     */
    updateSugerenciasConfig: async ({ request, locals }) => {
        if (!locals.session) return fail(401);
        const formData = await request.formData();
        const opcionesRaw = formData.get('opciones')?.toString() || '[]';

        try {
            const [existing] = await db.select().from(sugerenciasConfig).limit(1);
            const opciones = JSON.parse(opcionesRaw);

            if (existing) {
                await db.update(sugerenciasConfig).set({ opciones }).where(eq(sugerenciasConfig.id, existing.id));
            } else {
                await db.insert(sugerenciasConfig).values({ opciones });
            }
            return { configSuccess: true };
        } catch (e) {
            console.error('Error actualizando opciones de sugerencias:', e);
            return fail(500, { error: 'No se pudieron guardar las opciones.' });
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
    },

    /**
     * Elimina una postulación por ID
     */
    deletePostulacion: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = formData.get('id');
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await db.delete(postulaciones).where(eq(postulaciones.id, String(id)));
            return { postulacionDeleted: true };
        } catch (e) {
            console.error('Error eliminando postulación:', e);
            return fail(500, { error: 'Error al eliminar' });
        }
    },

    /**
     * Agrega una nueva sucursal de empleo
     */
    addEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const nombre = formData.get('nombre')?.toString().trim();
        if (!nombre) return fail(400, { error: 'Nombre requerido' });
        try {
            await db.insert(empleoSucursales).values({ nombre });
            return { sucursalAdded: true };
        } catch (e) {
            console.error('Error agregando sucursal:', e);
            return fail(500, { error: 'Error al agregar sucursal' });
        }
    },

    /**
     * Activa/desactiva una sucursal de empleo
     */
    toggleEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        const activa = formData.get('activa') === 'true';
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await db.update(empleoSucursales).set({ activa }).where(eq(empleoSucursales.id, id));
            return { sucursalToggled: true };
        } catch (e) {
            console.error('Error actualizando sucursal:', e);
            return fail(500, { error: 'Error al actualizar' });
        }
    },

    /**
     * Elimina una sucursal de empleo
     */
    deleteEmpleoSucursal: async ({ request, locals }) => {
        if (!locals.session) throw redirect(302, '/login');
        const formData = await request.formData();
        const id = Number(formData.get('id'));
        if (!id) return fail(400, { error: 'ID requerido' });
        try {
            await db.delete(empleoSucursales).where(eq(empleoSucursales.id, id));
            return { sucursalDeleted: true };
        } catch (e) {
            console.error('Error eliminando sucursal:', e);
            return fail(500, { error: 'Error al eliminar' });
        }
    }
};
