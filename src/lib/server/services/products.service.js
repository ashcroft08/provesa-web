import { productsRepository } from '../repositories/products.repository.js';

export const productsService = {
    /** Obtiene todos los productos */
    async getAllProducts() {
        return await productsRepository.getAll();
    },

    /** Agrega un nuevo producto con sortOrder automático y JSON parsing */
    async addProduct({ name, description, align, accentColor, displayType, images, features, categories }) {
        const existing = await productsRepository.getAll();
        const nextOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

        await productsRepository.create({
            name, description, align, accentColor, displayType,
            images: typeof images === 'string' ? JSON.parse(images) : images,
            features: typeof features === 'string' ? JSON.parse(features) : features,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories,
            sortOrder: nextOrder
        });
    },

    /** Actualiza un producto existente */
    async updateProduct(id, { name, description, align, accentColor, displayType, images, features, categories }) {
        await productsRepository.update(id, {
            name, description, align, accentColor, displayType,
            images: typeof images === 'string' ? JSON.parse(images) : images,
            features: typeof features === 'string' ? JSON.parse(features) : features,
            categories: typeof categories === 'string' ? JSON.parse(categories) : categories
        });
    },

    /** Elimina un producto */
    async deleteProduct(id) {
        await productsRepository.remove(id);
    }
};
