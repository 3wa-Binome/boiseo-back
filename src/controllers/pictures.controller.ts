import { Request, Response } from "express";
import { APIResponse, logger } from "../utils";
import { picturesModel, productsModel } from "../models";
import z from "zod";
import { picturesValidation } from "../validations";

export const picturesController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer toutes les pictures");
            const pictures = await picturesModel.getAll();
            APIResponse(response, pictures, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des pictures: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des pictures",
                500,
            );
        }
    },
    getAllByProduct: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer toutes les pictures du product : ${id}`) // Log d'information en couleur
            
            const product = await productsModel.get(id);
            if (!product) {
                logger.error("Product inexistant");
                return APIResponse(response, null, "Product inexistant", 404);
            }

            const pictures = await picturesModel.getAllByProduct(id);
            APIResponse(response, pictures, "OK");
        } catch (error: any) {
            logger.error(`Erreur lors de la récupération des pictures du product cible: `, error);
            APIResponse(response, null, "Erreur lors de la récupération des pictures", 500);
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer la picture avec l'id: ${id}`);

            const picture = await picturesModel.get(id);

            if (!picture) {
                logger.error("picture inexistant");
                return APIResponse(response, null, "picture inexistant", 404);
            }
            APIResponse(response, picture, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du picture: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération du picture",
                500,
            );
        }
    },
    create: async (request: Request, response: Response) => {
        try {
            logger.info("[POST] Créer un picture") // Log d'information en couleur

            const pictureData = picturesValidation.parse(request.body);
            const { user } = response.locals;

            const picture = await picturesModel.create({
                userId: user.id,
                ...pictureData
            });
            APIResponse(response, picture, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la création du picture: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la création du picture", 500);
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier le picture avec l'id: ${id}`);

            const picture = await picturesModel.get(id);
            if (!picture) {
                logger.error("picture inexistant");
                return APIResponse(response, null, "picture inexistant", 404);
            }

            const pictureData = picturesValidation.parse(request.body)

            await picturesModel.update(id, pictureData)
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj du picture: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la màj du picture", 500);
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer la picture avec l'id: ${id}`);

            const picture = await picturesModel.get(id);
            if (!picture) {
                logger.error("picture inexistant");
                return APIResponse(response, null, "picture inexistant", 404);
            }

            await picturesModel.delete(id);

            return APIResponse(response, null, "picture supprimé", 200);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la suppression du picture: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la suppression du picture",
                500,
            );
        }
    },
};
