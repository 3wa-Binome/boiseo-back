import { Request, Response } from "express";
import { APIResponse, logger } from "../utils";
import { materialsModel, usersModel } from "../models";
import z from "zod";
import { materialsValidation } from "../validations";

export const materialsController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les materials");
            const materials = await materialsModel.getAll();
            APIResponse(response, materials, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des materials: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des materials",
                500,
            );
        }
    },
    getAllByUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer tous les materials du utilisateur : ${id}`) // Log d'information en couleur
            
            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            const materials = await materialsModel.getAllByUser(id);
            APIResponse(response, materials, "OK");
        } catch (error: any) {
            logger.error(`Erreur lors de la récupération des materials du utilisateur cible: `, error);
            APIResponse(response, null, "Erreur lors de la récupération des materials", 500);
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer le material avec l'id: ${id}`);

            const material = await materialsModel.get(id);

            if (!material) {
                logger.error("Material inexistant");
                return APIResponse(response, null, "Material inexistant", 404);
            }
            APIResponse(response, material, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du material: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération du material",
                500,
            );
        }
    },
    create: async (request: Request, response: Response) => {
        try {
            logger.info("[POST] Créer un material") // Log d'information en couleur

            const materialData = materialsValidation.parse(request.body);
            const { user } = response.locals;

            const material = await materialsModel.create({
                userId: user.id,
                ...materialData
            });
            APIResponse(response, material, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la création du material: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la création du material", 500);
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier le material avec l'id: ${id}`);

            const material = await materialsModel.get(id);
            if (!material) {
                logger.error("Material inexistant");
                return APIResponse(response, null, "Material inexistant", 404);
            }

            const materialData = materialsValidation.parse(request.body)

            await materialsModel.update(id, materialData)
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj du material: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la màj du material", 500);
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer le material avec l'id: ${id}`);

            const material = await materialsModel.get(id);
            if (!material) {
                logger.error("Material inexistant");
                return APIResponse(response, null, "Material inexistant", 404);
            }

            await materialsModel.delete(id);

            return APIResponse(response, null, "Material supprimé", 200);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la suppression du material: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la suppression du material",
                500,
            );
        }
    },
};
