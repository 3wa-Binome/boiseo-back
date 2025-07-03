import { db } from "../config/pool";
import { logger } from "../utils";
import {
    categories,
    materials,
    products,
    productsMaterials,
    suppliers,
} from "../schemas";
import { NewMaterial } from "../entities";
import { eq } from "drizzle-orm";

export const materialsModel = {
    getAll: async () => {
        try {
            const materialsList = await db.query.materials.findMany({
                columns: {
                    id: true,
                    name: true,
                    supplierId: true,
                },
            });

            // Pour chaque material, on récupère son supplier et ses productsMaterials
            const enrichedMaterials = await Promise.all(
                materialsList.map(async (material) => {
                    // Récupérer le supplier
                    const supplier = await db.query.suppliers.findFirst({
                        where: eq(suppliers.id, material.supplierId),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    // Récupérer les productsMaterials liés à ce material
                    const productsMaterialsLists = await db.query
                        .productsMaterials
                        .findMany({
                            where: eq(
                                productsMaterials.materialId,
                                material.id,
                            ),
                            columns: {
                                id: true,
                                quantity: true,
                                productId: true,
                            },
                        });

                    // Pour chaque productMaterial, récupérer le produit et sa catégorie
                    const enrichedProductsMaterials = await Promise.all(
                        productsMaterialsLists.map(async (pm) => {
                            const product = await db.query.products.findFirst({
                                where: eq(products.id, pm.productId),
                                columns: {
                                    id: true,
                                    name: true,
                                    categoryId: true,
                                },
                            });

                            const category = product
                                ? await db.query.categories.findFirst({
                                    where: eq(
                                        categories.id,
                                        product.categoryId,
                                    ),
                                    columns: {
                                        id: true,
                                        name: true,
                                    },
                                })
                                : null;

                            return {
                                ...pm,
                                product: product
                                    ? { ...product, category }
                                    : null,
                            };
                        }),
                    );

                    return {
                        ...material,
                        supplier,
                        productsMaterials: enrichedProductsMaterials,
                    };
                }),
            );

            return enrichedMaterials;
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des materials: ",
                error,
            );
            throw new Error("Impossible de récupérer les materials");
        }
    },
    get: async (id: string) => {
        try {
            const material = await db.query.materials.findFirst({
                where: eq(materials.id, id),
                columns: {
                    id: true,
                    name: true,
                    description: true,
                    supplierId: true,
                },
            });

            if (!material) {
                throw new Error("Matériau introuvable");
            }

            // Récupérer le fournisseur
            const supplier = await db.query.suppliers.findFirst({
                where: eq(suppliers.id, material.supplierId),
                columns: {
                    id: true,
                    name: true,
                },
            });

            // Récupérer les liaisons productsMaterials
            const productsMaterialsList = await db.query.productsMaterials
                .findMany({
                    where: eq(productsMaterials.materialId, material.id),
                    columns: {
                        id: true,
                        quantity: true,
                        productId: true,
                    },
                });

            // Pour chaque liaison, récupérer le produit et sa catégorie
            const enrichedProductsMaterials = await Promise.all(
                productsMaterialsList.map(async (pm) => {
                    const product = await db.query.products.findFirst({
                        where: eq(products.id, pm.productId),
                        columns: {
                            id: true,
                            name: true,
                            categoryId: true,
                        },
                    });

                    const category = product?.categoryId
                        ? await db.query.categories.findFirst({
                            where: eq(categories.id, product.categoryId),
                            columns: {
                                id: true,
                                name: true,
                            },
                        })
                        : null;

                    return {
                        ...pm,
                        product: product ? { ...product, category } : null,
                    };
                }),
            );

            // Résultat final
            const enrichedMaterial = {
                ...material,
                supplier,
                productsMaterials: enrichedProductsMaterials,
            };

            return enrichedMaterial;
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du material: ", error);
            throw new Error("Impossible de récupérer le material");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            const materialsList = await db.query.materials.findMany({
                where: eq(materials.userId, userId),
                columns: {
                    id: true,
                    name: true,
                    supplierId: true,
                },
            });

            const enrichedMaterials = await Promise.all(
                materialsList.map(async (material) => {
                    const supplier = await db.query.suppliers.findFirst({
                        where: eq(suppliers.id, material.supplierId),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    return {
                        ...material,
                        supplier,
                    };
                }),
            );

            return enrichedMaterials;
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les materials de ${userId}: +`,
                error,
            );
            return [];
        }
    },
    create: async (material: NewMaterial) => {
        try {
            return await db.insert(materials).values(material);
        } catch (error: any) {
            logger.error("Erreur lors de la création du material: ", error);
            throw new Error("Impossible de créer le material");
        }
    },
    update: async (id: string, material: Partial<NewMaterial>) => {
        try {
            return await db.update(materials).set(material).where(
                eq(materials.id, id),
            );
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour du material: ", error);
            throw new Error("Impossible de mettre à jour le material");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(materials).where(eq(materials.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression du material: ", error);
            throw new Error("Impossible de supprimer le material");
        }
    },
};
