import { db } from "../config/pool";
import { logger } from "../utils";
import { categories, materials, products } from "../schemas";
import { NewCategory } from "../entities";
import { eq } from "drizzle-orm";

export const categoriesModel = {
    getAll: async () => {
        try {
            // Étape 1 : récupérer toutes les catégories
            const categoriesList = await db.query.categories.findMany({
                columns: {
                    id: true,
                    name: true,
                    createdAt: true, // ajoute les colonnes que tu veux
                },
            });

            // Étape 2 : pour chaque catégorie, récupérer ses produits
            const enrichedCategories = await Promise.all(
                categoriesList.map(async (category) => {
                    const productsLists = await db.query.products.findMany({
                        where: eq(products.categoryId, category.id),
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                        },
                    });

                    return {
                        ...category,
                        products: productsLists,
                        productCount: productsLists.length,
                        productMadeCount: productsLists.reduce(
                            (total, product) => total + (product.quantity ?? 0),
                            0,
                        ),
                    };
                }),
            );

            return enrichedCategories;
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des categories: ",
                error,
            );
            throw new Error("Impossible de récupérer les categories");
        }
    },
    get: async (id: string) => {
        try {
            // Étape 1 : récupérer la catégorie seule
            const category = await db.query.categories.findFirst({
                where: eq(categories.id, id),
                columns: {
                    id: true,
                    name: true,
                    createdAt: true, // ajoute les colonnes que tu veux
                },
            });

            if (!category) {
                throw new Error("Catégorie introuvable");
            }

            // Étape 2 : récupérer les produits liés à cette catégorie
            const productsLists = await db.query.products.findMany({
                where: eq(products.categoryId, category.id),
                columns: {
                    id: true,
                    name: true,
                    quantity: true,
                },
            });

            // Étape 3 : enrichir la catégorie avec les produits
            return {
                ...category,
                products: productsLists,
                productCount: productsLists.length,
                productMadeCount: productsLists.reduce(
                    (total, product) => total + (product.quantity ?? 0),
                    0,
                ),
            };
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération du categorie: ",
                error,
            );
            throw new Error("Impossible de récupérer le categorie");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            const categoriesList = await db.query.categories.findMany({
                where: eq(categories.userId, userId),
                columns: {
                    id: true,
                    name: true,
                    createdAt: true, // ajoute les colonnes nécessaires
                },
            });

            const enrichedCategories = await Promise.all(
                categoriesList.map(async (category) => {
                    const productsLists = await db.query.products.findMany({
                        where: eq(products.categoryId, category.id),
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                        },
                    });

                    return {
                        ...category,
                        products: productsLists,
                        productCount: productsLists.length,
                        productMadeCount: productsLists.reduce(
                            (total, product) => total + (product.quantity ?? 0),
                            0,
                        ),
                    };
                }),
            );

            return enrichedCategories;
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les categories de ${userId}: +`,
                error,
            );
            return [];
        }
    },
    create: async (category: NewCategory) => {
        try {
            return await db.insert(categories).values(category);
        } catch (error: any) {
            logger.error("Erreur lors de la création du categorie: ", error);
            throw new Error("Impossible de créer le categorie");
        }
    },
    update: async (id: string, category: Partial<NewCategory>) => {
        try {
            return await db.update(categories).set(category).where(
                eq(categories.id, id),
            );
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour du categorie: ", error);
            throw new Error("Impossible de mettre à jour le categorie");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(categories).where(eq(categories.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression du categorie: ", error);
            throw new Error("Impossible de supprimer le categorie");
        }
    },
};
