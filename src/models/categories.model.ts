import { db } from "../config/pool";
import { logger } from "../utils";
import { categories, materials } from "../schemas";
import { NewCategory } from "../entities";
import { eq } from "drizzle-orm";

export const categoriesModel = {
    getAll: async () => {
        try {
            const response = await db.query.categories.findMany({
                with: {
                    products: {
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                        },
                    },
                },
            });

            if (response) {
                response.map((category) => ({
                    ...category,
                    productCount: category.products.length,
                    productMadeCount: category.products.reduce(
                        (total, product) => total + (product.quantity ?? 0),
                        0,
                    ),
                }));
            }

            return response
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
            return await db.query.categories.findFirst({
                where: eq(categories.id, id),
                with: {
                    products: {
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                        },
                    },
                },
            });
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
            const response = await db.query.categories.findMany({
                where: eq(categories.userId, userId),
                with: {
                    products: {
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                        },
                    },
                },
            });

            if (response) {
                response.map((category) => ({
                    ...category,
                    productCount: category.products.length,
                    productMadeCount: category.products.reduce(
                        (total, product) => total + (product.quantity ?? 0),
                        0,
                    ),
                }));
            }

            return categories;
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
