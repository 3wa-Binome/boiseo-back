import { Request, Response } from "express";
import { APIResponse, logger } from "../utils";
import { suppliersModel, usersModel } from "../models";
import z from "zod";
import { suppliersValidation } from "../validations";

export const suppliersController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les suppliers");
            const suppliers = await suppliersModel.getAll();
            APIResponse(response, suppliers, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des suppliers: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des suppliers",
                500,
            );
        }
    },
    getAllByUser: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer tous les suppliers du utilisateur : ${id}`) // Log d'information en couleur
            
            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            const suppliers = await suppliersModel.getAllByUser(id);
            APIResponse(response, suppliers, "OK");
        } catch (error: any) {
            logger.error(`Erreur lors de la récupération des suppliers du utilisateur cible: `, error);
            APIResponse(response, null, "Erreur lors de la récupération des suppliers", 500);
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer l'supplier avec l'id: ${id}`);

            const supplier = await suppliersModel.get(id);

            if (!supplier) {
                logger.error("Supplier inexistant");
                return APIResponse(response, null, "Supplier inexistant", 404);
            }
            APIResponse(response, supplier, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération du supplier: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération du supplier",
                500,
            );
        }
    },
    create: async (request: Request, response: Response) => {
        try {
            logger.info("[POST] Créer un supplier") // Log d'information en couleur

            const supplierData = suppliersValidation.parse(request.body);
            const { user } = response.locals;

            const supplier = await suppliersModel.create({
                userId: user.id,
                ...supplierData
            });
            APIResponse(response, supplier, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la création du supplier: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la création du supplier", 500);
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier le supplier avec l'id: ${id}`);

            const supplier = await suppliersModel.get(id);
            if (!supplier) {
                logger.error("Supplier inexistant");
                return APIResponse(response, null, "Supplier inexistant", 404);
            }

            const supplierData = suppliersValidation.parse(request.body)

            await suppliersModel.update(id, supplierData)
            APIResponse(response, null, "OK", 201);
        } catch (error: any) {
            logger.error("Erreur lors de la màj du supplier: ", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur lors de la màj du supplier", 500);
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer l'supplier avec l'id: ${id}`);

            const supplier = await suppliersModel.get(id);
            if (!supplier) {
                logger.error("Supplier inexistant");
                return APIResponse(response, null, "Supplier inexistant", 404);
            }

            await suppliersModel.delete(id);

            // Si l'utilisateur N'EST PAS admin, il doit être déconnecté
            if (!response.locals.supplier.isAdmin) {
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
