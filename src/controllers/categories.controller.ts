import { Request, Response } from "express";
import { APIResponse, logger } from "../utils";
import { categoriesModel, usersModel } from "../models";
import z from "zod";
import { categoriesValidation } from "../validations";

export const categoriesController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les categories");
            const categories = await categoriesModel.getAll();
            APIResponse(response, categories, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des categories: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des categories",
                500,
            );
        }
    },
    getAllByUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer tous les categories de la utilisateur : ${id}`) // Log d'information en couleur
            
            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            const categories = await categoriesModel.getAllByUser(id);
            APIResponse(response, categories, "OK");
        } catch (error: any) {
            logger.error(`Erreur lors de la récupération des categories de la utilisateur cible: `, error);
            APIResponse(response, null, "Erreur lors de la récupération des categories", 500);
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer le categorie avec l'id: ${id}`);

            const category = await categoriesModel.get(id);

            if (!category) {
                logger.error("categorie inexistant");
                return APIResponse(response, null, "categorie inexistant", 404);
            }
            APIResponse(response, category, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération de la categorie: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération de la categorie",
                500,
            );
        }
    },
    create: async (request: Request, response: Response) => {
        try {
            logger.info("[POST] Créer une categorie") // Log d'information en couleur

            const categoryData = categoriesValidation.parse(request.body);
            const { user } = response.locals;

            const category = await categoriesModel.create({
                userId: user.id,
                ...categoryData
            });
            APIResponse(response, category, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la création de la categorie: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la création de la categorie", 500);
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier le categorie avec l'id: ${id}`);

            const category = await categoriesModel.get(id);
            if (!category) {
                logger.error("categorie inexistant");
                return APIResponse(response, null, "categorie inexistant", 404);
            }

            const categoryData = categoriesValidation.parse(request.body)

            await categoriesModel.update(id, categoryData)
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj de la categorie: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la màj de la categorie", 500);
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer le categorie avec l'id: ${id}`);

            const category = await categoriesModel.get(id);
            if (!category) {
                logger.error("categorie inexistant");
                return APIResponse(response, null, "categorie inexistant", 404);
            }

            await categoriesModel.delete(id);

            // Si l'utilisateur N'EST PAS admin, il doit être déconnecté
            if (!response.locals.categorie.isAdmin) {
                response.clearCookie("accessToken");
                return APIResponse(
                    response,
                    null,
                    "Utilisateur supprimé et déconnecté",
                    200,
                );
            }

            return APIResponse(response, null, "Utilisateur supprimé", 200);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la suppression de la utilisateur: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la suppression de la utilisateur",
                500,
            );
        }
    },
};
