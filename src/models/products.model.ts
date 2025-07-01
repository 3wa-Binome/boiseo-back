import { db } from "../config/pool";
import { logger } from "../utils";
import { materials, products } from "../schemas";
import { NewProduct } from "../entities";
import { eq } from "drizzle-orm";

export const productsModel = {
    getAll: async () => {
        try {
            return await db.query.products.findMany({
                with: {
                    categories: {
                        columns: {
                            id: true,
                            name: true
                        }
                    },
                },
            });
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
            return await db.query.products.findFirst({
                where: eq(products.id, id),
                with: {
                    categories: {
                        columns: {
                            id: true,
                            name: true
                        }
                    },
                },
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du product: ", error);
            throw new Error("Impossible de récupérer le product");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            return await db.query.products.findMany({
                where: eq(products.userId, userId),
                with: {
                    categories: {
                        columns: {
                            id: true,
                            name: true
                        }
                    },
                },
            });
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
                where: eq(products.categoryId, categoryId),
                with: {
                    categories: {
                        columns: {
                            id: true,
                            name: true
                        }
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
            return await db.insert(products).values(product);
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
};