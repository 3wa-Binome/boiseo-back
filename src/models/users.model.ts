import { db } from "../config/pool";
import { logger } from "../utils";
import { users } from "../schemas";
import { NewUser } from "../entities";
import { eq } from "drizzle-orm";

export const userModel = {
    getAll: async () => {
        try {
            return await db.query.users.findMany({
                columns: {
                    id: true,
                    name: true,
                },
                // with: {
                //     products: {
                //         columns: {
                //             id: true,
                //             name: true,
                //             quantity: true,
                //             description: true,
                //         },
                //         with: {
                //             category: {
                //                 columns: {
                //                     name: true,
                //                 },
                //             }
                //         },
                //     },
                // },
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des utilisateurs: ", error);
            throw new Error("Impossible de récupérer les utilisateurs");
        }
    },
    get: async (id: string) => {
        try {
            return await db.query.users.findFirst({
                columns: {
                    id: true,
                    name: true,
                },
                where: eq(users.id, id),
                with: {
                    products: {
                        columns: {
                            id: true,
                            name: true,
                            quantity: true,
                            description: true,
                        },
                        with: {
                            category: {
                                columns: {
                                    name: true,
                                },
                            }
                        },
                    },
                },
            });
        } catch (error: any) {
            logger.error("Erreur lors de la récupération de l'utilisateur: ", error);
            throw new Error("Impossible de récupérer l'utilisateur");
        }
    },
    findByCredentials: async (email: string) => {
        try {
            return await db.select({
                id: users.id,
                password: users.password,
                email: users.email,
                name: users.name,
            })
                .from(users)
                .where(eq(users.email, email));
        } catch (error: any) {
            logger.error("Erreur lors de la récupération de l'utilisateur: ", error);
            throw new Error("Impossible de récupérer l'utilisateur");
        }
    },
    create: async (user: NewUser) => {
        try {
            const {
                name,
                email,
                password,
            } = user;

            return await db.insert(users).values({
                name,
                email,
                password,
            })
        } catch (error: any) {
            logger.error("Erreur lors de la création de l'utilisateur: ", error);
            throw new Error("Impossible de créer l'utilisateur");
        }
    },
    update: async (id: string, user: Partial<NewUser>) => {
        try {
            return await db.update(users).set(user).where(eq(users.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la mise à jour de l'utilisateur: ", error);
            throw new Error("Impossible de mettre à jour l'utilisateur");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(users).where(eq(users.id, id));
        } catch (error: any) {
            logger.error("Erreur lors de la suppression de l'utilisateur: ", error);
            throw new Error("Impossible de supprimer l'utilisateur");
        }
    },
};
