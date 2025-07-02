import { db } from "../config/pool";
import { logger } from "../utils";
import {
    categories,
    materials,
    pictures,
    products,
    productsMaterials,
    suppliers,
    users,
} from "../schemas";
import { NewUser } from "../entities";
import { eq, isNull } from "drizzle-orm";

export const usersModel = {
    getAll: async () => {
        try {
            const usersLists = await db.query.users.findMany({
                columns: {
                    id: true,
                    name: true,
                },
            });

            const enrichedUsers = await Promise.all(
                usersLists.map(async (user) => {
                    // Récupérer les catégories de l'utilisateur
                    const categoriesLists = await db.query.categories.findMany({
                        where: eq(categories.userId, user.id),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    // Pour chaque catégorie, récupérer les produits
                    const enrichedCategories = await Promise.all(
                        categoriesLists.map(async (category) => {
                            const productsLists = await db.query.products
                                .findMany({
                                    where: eq(products.categoryId, category.id),
                                    columns: {
                                        id: true,
                                    },
                                });

                            return {
                                ...category,
                                productsLists,
                            };
                        }),
                    );

                    // Récupérer les images sans produit
                    const picturesLists = await db.query.pictures.findMany({
                        where: isNull(pictures.productId),
                        columns: {
                            id: true,
                            src: true,
                        },
                    });

                    // Récupérer les matériaux de l'utilisateur
                    const materialsLists = await db.query.materials.findMany({
                        where: eq(materials.userId, user.id),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    // Pour chaque matériau, récupérer les productsMaterials
                    const enrichedMaterials = await Promise.all(
                        materialsLists.map(async (material) => {
                            const productsMaterialsLists = await db.query
                                .productsMaterials.findMany({
                                    where: eq(
                                        productsMaterials.materialId,
                                        material.id,
                                    ),
                                    columns: {
                                        quantity: true,
                                    },
                                });

                            return {
                                ...material,
                                productsMaterials: productsMaterialsLists,
                            };
                        }),
                    );

                    // Récupérer les fournisseurs de l'utilisateur
                    const suppliersLists = await db.query.suppliers.findMany({
                        where: eq(suppliers.userId, user.id),
                        columns: {
                            id: true,
                            name: true,
                        },
                    });

                    return {
                        ...user,
                        categories: enrichedCategories,
                        picturesLists,
                        materials: enrichedMaterials,
                        suppliersLists,
                    };
                }),
            );

            return enrichedUsers;
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
                where: eq(users.id, id),
                columns: {
                    id: true,
                    name: true,
                    createdAt: true,
                },
            });

            if (!user) {
                throw new Error("Utilisateur introuvable");
            }

            // Récupérer les catégories de l'utilisateur
            const categoriesList = await db.query.categories.findMany({
                where: eq(categories.userId, user.id),
                columns: {
                    id: true,
                    name: true,
                },
            });

            const enrichedCategories = await Promise.all(
                categoriesList.map(async (category) => {
                    const productsLists = await db.query.products.findMany({
                        where: eq(products.categoryId, category.id),
                        columns: {
                            id: true,
                        },
                    });

                    return {
                        ...category,
                        products,
                        productCount: productsLists.length,
                    };
                }),
            );

            // Récupérer les images sans produit
            const picturesLists = await db.query.pictures.findMany({
                where: isNull(pictures.productId),
                columns: {
                    id: true,
                    src: true,
                },
            });

            // Récupérer les matériaux de l'utilisateur
            const materialsLists = await db.query.materials.findMany({
                where: eq(materials.userId, user.id),
                columns: {
                    id: true,
                    name: true,
                },
            });

            const enrichedMaterials = await Promise.all(
                materialsLists.map(async (material) => {
                    const productsMaterialsLists = await db.query
                        .productsMaterials.findMany({
                            where: eq(
                                productsMaterials.materialId,
                                material.id,
                            ),
                            columns: {
                                quantity: true,
                            },
                        });

                    return {
                        ...material,
                        productsMaterials: productsMaterialsLists,
                    };
                }),
            );

            // Récupérer les fournisseurs de l'utilisateur
            const suppliersLists = await db.query.suppliers.findMany({
                where: eq(suppliers.userId, user.id),
                columns: {
                    id: true,
                    name: true,
                },
            });

            // Résultat final
            const enrichedUser = {
                ...user,
                categories: enrichedCategories,
                picturesLists,
                materials: enrichedMaterials,
                suppliersLists,
            };

            return enrichedUser;
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
