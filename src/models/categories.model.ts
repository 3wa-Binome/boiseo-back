import { db } from "../config/pool";
import { logger } from "../utils";
import { materials, categories } from "../schemas";
import { NewCategory } from "../entities";
import { eq } from "drizzle-orm";

export const categoriesModel = {
    getAll: async () => {
        try {
            return await db.query.categories.findMany({
            });
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
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du categorie: ", error);
            throw new Error("Impossible de récupérer le categorie");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            return await db.query.categories.findMany({
                where: eq(categories.userId, userId),
            });
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
