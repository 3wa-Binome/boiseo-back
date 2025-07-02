import { db } from "../config/pool";
import { logger } from "../utils";
import { users } from "../schemas";
import { NewUser } from "../entities";
import { eq } from "drizzle-orm";

export const usersModel = {
    getAll: async () => {
        try {
            return await db.query.users.findMany({
                columns: {
                    id: true,
                    name: true,
                },
                with: {
                    categories: {
                        with: {
                            products: {
                                columns: { id: true },
                            },
                        },
                    },
                    pictures: {
                        where: (fields, operators) =>
                            operators.isNull(fields.productId),
                        columns: {
                            id: true,
                            src: true,
                        },
                    },
                    materials: {
                        columns: {
                            id: true,
                            name: true
                        },
                        with: {
                            productsMaterials: {
                                columns: {
                                    quantity: true
                                }
                            }
                        }
                    },
                    suppliers: {
                        columns: {
                            id: true,
                            name: true
                        }
                    }
                },
            });
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des utilisateurs: ",
                error,
            );
            throw new Error("Impossible de récupérer les utilisateurs");
        }
    },
    get: async (id: string) => {
        try {
            const user = await db.query.users.findFirst({
                columns: {
                    id: true,
                    name: true,
                    createdAt: true,
                },
                where: eq(users.id, id),
                with: {
                    categories: {
                        with: {
                            products: {
                                columns: { id: true },
                            },
                        },
                    },
                    pictures: {
                        where: (fields, operators) =>
                            operators.isNull(fields.productId),
                        columns: {
                            id: true,
                            src: true,
                        },
                    },
                    materials: {
                        columns: {
                            id: true,
                            name: true
                        },
                        with: {
                            productsMaterials: {
                                columns: {
                                    quantity: true
                                }
                            }
                        }
                    },
                    suppliers: {
                        columns: {
                            id: true,
                            name: true
                        }
                    }
                },
            });

            if (user) {
                user.categories = user.categories.map((category) => ({
                    ...category,
                    productCount: category.products.length,
                }));
            }

            return user

        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération de l'utilisateur: ",
                error,
            );
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
            logger.error(
                "Erreur lors de la récupération de l'utilisateur: ",
                error,
            );
            throw new Error("Impossible de récupérer l'utilisateur");
        }
    },
    create: async (user: NewUser) => {
        try {
            return await db.insert(users).values(user);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la création de l'utilisateur: ",
                error,
            );
            throw new Error("Impossible de créer l'utilisateur");
        }
    },
    update: async (id: string, user: Partial<NewUser>) => {
        try {
            return await db.update(users).set(user).where(eq(users.id, id));
        } catch (error: any) {
            logger.error(
                "Erreur lors de la mise à jour de l'utilisateur: ",
                error,
            );
            throw new Error("Impossible de mettre à jour l'utilisateur");
        }
    },
    delete: async (id: string) => {
        try {
            return await db.delete(users).where(eq(users.id, id));
        } catch (error: any) {
            logger.error(
                "Erreur lors de la suppression de l'utilisateur: ",
                error,
            );
            throw new Error("Impossible de supprimer l'utilisateur");
        }
    },
};
