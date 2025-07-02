import { db } from "../config/pool";
import { logger } from "../utils";
import {
    categories,
    materials,
    pictures,
    products,
    productsMaterials,
} from "../schemas";
import { NewProduct } from "../entities";
import { eq, inArray } from "drizzle-orm";
import { IMaterial } from "../types/materials.type";

export const productsModel = {
    getAll: async () => {
        try {
            const productsLists = await db.query.products.findMany({
                columns: {
                    id: true,
                    name: true,
                    quantity: true,
                    categoryId: true,
                },
            });

            const enrichedProducts = await Promise.all(
                productsLists.map(async (product) => {
                    // Récupérer la catégorie
                    const category = product.categoryId
                        ? await db.query.categories.findFirst({
                            where: eq(categories.id, product.categoryId),
                            columns: {
                                id: true,
                                name: true,
                            },
                        })
                        : null;

                    // Récupérer les liaisons productsMaterials
                    const productsMaterialsList = await db.query
                        .productsMaterials.findMany({
                            where: eq(productsMaterials.productId, product.id),
                            columns: {
                                id: true,
                                quantity: true,
                                materialId: true,
                            },
                        });

                    // Pour chaque liaison, récupérer le matériau
                    const enrichedProductsMaterials = await Promise.all(
                        productsMaterialsList.map(async (pm) => {
                            const material = await db.query.materials.findFirst(
                                {
                                    where: eq(materials.id, pm.materialId),
                                    columns: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            );

                            return {
                                ...pm,
                                material,
                            };
                        }),
                    );

                    // Récupérer les images
                    const picturesLists = await db.query.pictures.findMany({
                        where: eq(pictures.productId, product.id),
                        columns: {
                            id: true,
                            src: true,
                        },
                    });

                    return {
                        ...product,
                        category,
                        productsMaterials: enrichedProductsMaterials,
                        picturesLists,
                    };
                }),
            );

            return enrichedProducts;
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des products: ",
                error,
            );
            throw new Error("Impossible de récupérer les products");
        }
    },
    get: async (id: string) => {
        try {
            const product = await db.query.products.findFirst({
                where: eq(products.id, id),
                columns: {
                    id: true,
                    name: true,
                    quantity: true,
                    categoryId: true,
                },
            });

            if (!product) {
                throw new Error("Produit introuvable");
            }

            // Récupérer la catégorie
            const category = product.categoryId
                ? await db.query.categories.findFirst({
                    where: eq(categories.id, product.categoryId),
                    columns: {
                        id: true,
                        name: true,
                    },
                })
                : null;

            // Récupérer les liaisons productsMaterials
            const productsMaterialsList = await db.query.productsMaterials
                .findMany({
                    where: eq(productsMaterials.productId, product.id),
                    columns: {
                        id: true,
                        quantity: true,
                        materialId: true,
                    },
                });

            // Pour chaque liaison, récupérer le matériau
            const enrichedProductsMaterials = await Promise.all(
                productsMaterialsList.map(async (pm) => {
                    const material = await db.query.materials.findFirst({
                        where: eq(materials.id, pm.materialId),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    return {
                        ...pm,
                        material,
                    };
                }),
            );

            // Récupérer les images
            const picturesLists = await db.query.pictures.findMany({
                where: eq(pictures.productId, product.id),
                columns: {
                    id: true,
                    src: true,
                },
            });

            // Résultat final
            const enrichedProduct = {
                ...product,
                category,
                productsMaterials: enrichedProductsMaterials,
                picturesLists,
            };

            return enrichedProduct;
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du product: ", error);
            throw new Error("Impossible de récupérer le product");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            const productsList = await db.query.products.findMany({
                where: eq(products.userId, userId),
                columns: {
                    id: true,
                    name: true,
                    quantity: true,
                    categoryId: true,
                },
            });

            const enrichedProducts = await Promise.all(
                productsList.map(async (product) => {
                    // Récupérer la catégorie
                    const category = product.categoryId
                        ? await db.query.categories.findFirst({
                            where: eq(categories.id, product.categoryId),
                            columns: {
                                id: true,
                                name: true,
                            },
                        })
                        : null;

                    // Récupérer les liaisons productsMaterials
                    const productsMaterialsList = await db.query
                        .productsMaterials.findMany({
                            where: eq(productsMaterials.productId, product.id),
                            columns: {
                                id: true,
                                quantity: true,
                                materialId: true,
                            },
                        });

                    // Pour chaque liaison, récupérer le matériau
                    const enrichedProductsMaterials = await Promise.all(
                        productsMaterialsList.map(async (pm) => {
                            const material = await db.query.materials.findFirst(
                                {
                                    where: eq(materials.id, pm.materialId),
                                    columns: {
                                        id: true,
                                        name: true,
                                    },
                                },
                            );

                            return {
                                ...pm,
                                material,
                            };
                        }),
                    );

                    // Récupérer les images
                    const picturesLists = await db.query.pictures.findMany({
                        where: eq(pictures.productId, product.id),
                        columns: {
                            id: true,
                            src: true,
                        },
                    });

                    return {
                        ...product,
                        category,
                        productsMaterials: enrichedProductsMaterials,
                        picturesLists,
                    };
                }),
            );

            return enrichedProducts;
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les products de ${userId}: +`,
                error,
            );
            return [];
        }
    },
    getAllByCategory: async (categoryId: string) => {
        try {
            return await db.query.products.findMany({
                columns: {
                    id: true,
                    name: true,
                    quantity: true,
                },
                where: eq(products.categoryId, categoryId),
                with: {
                    category: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                    productsMaterials: {
                        columns: {
                            id: true,
                            quantity: true,
                        },
                        with: {
                            material: {
                                columns: {
                                    id: true,
                                    name: true,
                                },
                            },
                        },
                    },
                    pictures: {
                        columns: {
                            id: true,
                            src: true,
                        },
                    },
                },
            });
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les products de ${categoryId}: +`,
                error,
            );
            return [];
        }
    },
    create: async (product: NewProduct) => {
        try {
            const [result] = await db.insert(products).values(product)
                .$returningId();
            return result;
        } catch (error: any) {
            logger.error("Erreur lors de la création du product: ", error);
            throw new Error("Impossible de créer le product");
        }
    },
    update: async (id: string, product: Partial<NewProduct>) => {
        try {
            return await db.update(products).set(product).where(
                eq(products.id, id),
            );
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour du product: ", error);
            throw new Error("Impossible de mettre à jour le product");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(products).where(eq(products.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression du product: ", error);
            throw new Error("Impossible de supprimer le product");
        }
    },
    linkMaterials: async (productId: string, materialsList: IMaterial[]) => {
        try {
            // Optionnel : vérifier que tous les materialId existent
            const existingMaterials = await db.query.materials.findMany({
                where: inArray(
                    materials.id,
                    materialsList.map((m) => m.materialId),
                ),
            });

            if (existingMaterials.length !== materialsList.length) {
                throw new Error("Certains matériaux sont invalides");
            }

            // Supprimer les anciens liens si nécessaire
            await db.delete(productsMaterials).where(
                eq(productsMaterials.productId, productId),
            );

            // Insérer les nouveaux liens
            await db.insert(productsMaterials).values(
                materialsList.map((m) => ({
                    productId,
                    materialId: m.materialId,
                    quantity: m.quantity,
                })),
            );
        } catch (error) {
            logger.error("Erreur lors de l'association des matériaux :", error);
            throw new Error("Impossible d'associer les matériaux au produit");
        }
    },
};
