import { db } from "../config/pool";
import { logger } from "../utils";
import { materials, pictures } from "../schemas";
import { NewPicture } from "../entities";
import { eq } from "drizzle-orm";

export const picturesModel = {
    getAll: async () => {
        try {
            return await db.query.pictures.findMany({});
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des pictures: ",
                error,
            );
            throw new Error("Impossible de récupérer les pictures");
        }
    },
    get: async (id: string) => {
        try {
            return await db.query.pictures.findFirst({
                where: eq(pictures.id, id),
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du picture: ", error);
            throw new Error("Impossible de récupérer le picture");
        }
    },
    getAllByProduct: async (productId: string) => {
        try {
            return await db.query.pictures.findMany({
                where: eq(pictures.productId, productId),
            });
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les pictures de ${productId}: +`,
                error,
            );
            return [];
        }
    },
    create: async (picture: NewPicture) => {
        try {
            const {
                src,
                userId,
                productId
            } = picture;

            return await db.insert(pictures).values({
                src,
                userId,
                productId
            });
        } catch (error: any) {
            logger.error("Erreur lors de la création du picture: ", error);
            throw new Error("Impossible de créer le picture");
        }
    },
    update: async (id: string, picture: Partial<NewPicture>) => {
        try {
            return await db.update(pictures).set(picture).where(
                eq(pictures.id, id),
            );
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour du picture: ", error);
            throw new Error("Impossible de mettre à jour le picture");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(pictures).where(eq(pictures.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression du picture: ", error);
            throw new Error("Impossible de supprimer le picture");
        }
    },
};
