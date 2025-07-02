import { db } from "../config/pool";
import { logger } from "../utils";
import { materials, suppliers } from "../schemas";
import { NewMaterial } from "../entities";
import { eq } from "drizzle-orm";

export const materialsModel = {
    getAll: async () => {
        try {
            return await db.query.materials.findMany({
                with: {
                    supplier: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                    productsMaterials: {
                        columns: {
                            id: true,
                            quantity: true
                        },
                        with: {
                            product: {
                                columns: {
                                    id: true,
                                    name: true
                                },
                                with: {
                                    category: {
                                        columns: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                },
            });
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
            return await db.query.materials.findFirst({
                where: eq(materials.id, id),
                with: {
                    supplier: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                    productsMaterials: {
                        columns: {
                            id: true,
                            quantity: true
                        },
                        with: {
                            product: {
                                columns: {
                                    id: true,
                                    name: true
                                },
                                with: {
                                    category: {
                                        columns: {
                                            id: true,
                                            name: true
                                        }
                                    }
                                }
                            },
                        }
                    }
                },
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du material: ", error);
            throw new Error("Impossible de récupérer le material");
        }
    },
    getAllByUser: async (userId: string) => {
        try {
            return await db.query.materials.findMany({
                where: eq(materials.userId, userId),
                with: {
                    supplier: {
                        columns: {
                            id: true,
                            name: true,
                        },
                    },
                },
            });
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
