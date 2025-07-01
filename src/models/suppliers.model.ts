import { db } from "../config/pool";
import { logger } from "../utils";
import { materials, suppliers } from "../schemas";
import { NewSupplier } from "../entities";
import { eq } from "drizzle-orm";

export const suppliersModel = {
    getAll: async () => {
        try {
            return await db.query.suppliers.findMany({
                with: {
                    materials: {},
                },
            });
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des suppliers: ",
                error,
            );
            throw new Error("Impossible de récupérer les suppliers");
        }
    },
    get: async (id: string) => {
        try {
            return await db.query.suppliers.findFirst({
                where: eq(suppliers.id, id),
                with: {
                    materials: {},
                },
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du supplier: ", error);
            throw new Error("Impossible de récupérer le supplier");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            return await db.query.suppliers.findMany({
                where: eq(suppliers.userId, userId),
                with: {
                    materials: {},
                },
            });
        } catch (error: any) {
            logger.error(
                `Impossible de récupérer les suppliers de ${userId}: +`,
                error,
            );
            return [];
        }
    },
    create: async (supplier: NewSupplier) => {
        try {

            return await db.insert(suppliers).values(supplier);
        } catch (error: any) {
            logger.error("Erreur lors de la création du supplier: ", error);
            throw new Error("Impossible de créer le supplier");
        }
    },
    update: async (id: string, supplier: Partial<NewSupplier>) => {
        try {
            return await db.update(suppliers).set(supplier).where(
                eq(suppliers.id, id),
            );
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour du supplier: ", error);
            throw new Error("Impossible de mettre à jour le supplier");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(suppliers).where(eq(suppliers.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression du supplier: ", error);
            throw new Error("Impossible de supprimer le supplier");
        }
    },
};
