import { Request, Response } from "express";
import { APIResponse, logger } from "../utils";
import { categoriesModel, productsModel, usersModel } from "../models";
import z from "zod";
import { productsQuantityValidation, productsValidation } from "../validations";

export const productsController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les products");
            const products = await productsModel.getAll();
            APIResponse(response, products, "OK");
        } catch (error: any) {
            logger.error(
                "Erreur lors de la récupération des products: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des products",
                500,
            );
        }
    },
    getAllByUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(
                `[GET] Récupérer tous les products du utilisateur : ${id}`,
            ); // Log d'information en couleur

            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            const products = await productsModel.getAllByUser(id);
            APIResponse(response, products, "OK");
        } catch (error: any) {
            logger.error(
                `Erreur lors de la récupération des products du utilisateur cible: `,
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des products",
                500,
            );
        }
    },
    getAllByCategory: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(
                `[GET] Récupérer tous les products d'une catégorie' : ${id}`,
            ); // Log d'information en couleur

            const category = await categoriesModel.get(id);
            if (!category) {
                logger.error("Categorie inexistant");
                return APIResponse(response, null, "Categorie inexistant", 404);
            }

            const products = await productsModel.getAllByCategory(id);
            APIResponse(response, products, "OK");
        } catch (error: any) {
            logger.error(
                `Erreur lors de la récupération des products du utilisateur cible: `,
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des products",
                500,
            );
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer le product avec l'id: ${id}`);

            const product = await productsModel.get(id);

            if (!product) {
                logger.error("Product inexistant");
                return APIResponse(response, null, "Product inexistant", 404);
            }
            APIResponse(response, product, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du product: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération du product",
                500,
            );
        }
    },
    create: async (request: Request, response: Response) => {
        try {
            logger.info("[POST] Créer un product"); // Log d'information en couleur

            const productData = productsValidation.parse(request.body);
            const { user } = response.locals;

            const product = await productsModel.create({
                userId: user.id,
                ...productData,
            });
            APIResponse(response, product, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la création du product: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(
                    response,
                    error.errors,
                    "Le formulaire est invalide",
                    400,
                );
            }
            APIResponse(
                response,
                null,
                "Erreur lors de la création du product",
                500,
            );
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier le product avec l'id: ${id}`);

            const product = await productsModel.get(id);
            if (!product) {
                logger.error("Product inexistant");
                return APIResponse(response, null, "Product inexistant", 404);
            }

            const productData = productsValidation.parse(request.body);

            await productsModel.update(id, productData);
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj du product: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(
                    response,
                    error.errors,
                    "Le formulaire est invalide",
                    400,
                );
            }
            APIResponse(
                response,
                null,
                "Erreur lors de la màj du product",
                500,
            );
        }
    },
    updateQuantity: async (request: Request, response: Response) => {
        try {
            const { id, action } = request.params;

            logger.info(
                `[UPDATE] Modifier la quantity du product avec l'id: ${id}`,
            );

            if (action !== "remove" && action !== "add" ) {
                logger.error("Action incorrecte");
                return APIResponse(response, null, "Action incorrecte", 400);
            }

            const product = await productsModel.get(id);
            if (!product) {
                logger.error("Product inexistant");
                return APIResponse(response, null, "Product inexistant", 404);
            }

            const productData = productsQuantityValidation.parse(request.body);

            if (
                action === "remove" &&
                (product.quantity - productData.quantity < 0)
            ) {
                logger.error("La quantité ne peut pas être négative");
                return APIResponse(response, null, "Product inexistant", 400);
            }

            const newQuantity = action === "remove"
                ? product.quantity - productData.quantity
                : action === "add"
                ? product.quantity + productData.quantity
                : 0;

            await productsModel.update(id, { quantity: newQuantity });
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj du product: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(
                    response,
                    error.errors,
                    "Le formulaire est invalide",
                    400,
                );
            }
            APIResponse(
                response,
                null,
                "Erreur lors de la màj du product",
                500,
            );
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer le product avec l'id: ${id}`);

            const product = await productsModel.get(id);
            if (!product) {
                logger.error("Product inexistant");
                return APIResponse(response, null, "Product inexistant", 404);
            }

            await productsModel.delete(id);

            return APIResponse(response, null, "Utilisateur supprimé", 200);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la suppression du utilisateur: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la suppression du utilisateur",
                500,
            );
        }
    },
};
