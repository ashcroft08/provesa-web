import { productsRepository } from '../repositories/products.repository.js';

export const productsService = {
    /** 
     * Obtiene el catálogo completo de productos.
     * @returns {Promise<Array<Object>>}
     */
    async getAllProducts() {
        return await productsRepository.getAll();
    },

    /** 
     * Crea un nuevo producto con metadatos específicos.
     * @param {Object} params - Atributos del producto.
     * @param {string} params.name - Nombre.
     * @param {string} params.description - Descripción.
     * @param {string} params.align - Alineación (left/right).
     * @param {string} params.accentColor - Color de acento.
     * @param {string} params.displayType - Tipo de visualización.
     * @param {any} params.images - URLs de imágenes (JSON).
     * @param {any} params.features - Características (JSON).
     * @param {any} params.categories - Categorías (JSON).
     * @returns {Promise<void>}
     */
    async addProduct({ name, description, align, accentColor, displayType, images, features, categories }) {
        const existing = /** @type {any[]} */ (await productsRepository.getAll());
        const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

        await productsRepository.create({
            name, description, align, accentColor, displayType,
            images: typeof images === 'string' ? JSON.parse(images) : images,
            features: typeof features === 'string' ? JSON.parse(features) : features,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories,
            sortOrder: nextOrder
        });
    },

    /** 
     * Actualiza los datos de un producto existente.
     * @param {number} id - ID del producto.
     * @param {Object} params - Parámetros a actualizar.
     * @param {string} [params.name]
     * @param {string} [params.description]
     * @param {string} [params.align]
     * @param {string} [params.accentColor]
     * @param {string} [params.displayType]
     * @param {any} [params.images]
     * @param {any} [params.features]
     * @param {any} [params.categories]
     * @returns {Promise<void>}
     */
    async updateProduct(id, { name, description, align, accentColor, displayType, images, features, categories }) {
        await productsRepository.update(id, {
            name, description, align, accentColor, displayType,
            images: typeof images === 'string' ? JSON.parse(images) : images,
            features: typeof features === 'string' ? JSON.parse(features) : features,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories
        });
    },

    /** 
     * Elimina un producto por su ID.
     * @param {number} id - ID del producto.
     * @returns {Promise<void>}
     */
    async deleteProduct(id) {
        await productsRepository.remove(id);
    }
};
