import { Request, Response } from "express";
import { APIResponse, hashPassword, logger, verifyPassword } from "../utils";
import { usersModel } from "../models";
import z from "zod";
import { userRegisterValidation } from "../validations";

export const usersController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les users");
            const users = await usersModel.getAll();
            APIResponse(response, users, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération des users: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération des users",
                500,
            );
        }
    },
    get: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[GET] Récupérer l'user avec l'id: ${id}`);

            const user = await usersModel.get(id);

            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }
            APIResponse(response, user, "OK");
        } catch (error: any) {
            logger.error("Erreur lors de la récupération de l'user: ", error);
            APIResponse(
                response,
                null,
                "Erreur lors de la récupération de l'user",
                500,
            );
        }
    },
    update: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[UPDATE] Modifier l'user avec l'id: ${id}`);

            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            const { name, email, password } = userRegisterValidation.parse(
                request.body,
            );

            // on vérifie qu'un user n'a pas déjà cet adresse email
            const [emailAlreadyExists] = await usersModel.findByCredentials(
                email,
            );
            if (emailAlreadyExists) {
                logger.error("Cette adresse email est déjà utilisée");
                return APIResponse(
                    response,
                    null,
                    "Cette adresse email est déjà utilisée",
                    400,
                );
            }

            // On hash le mot de passe en clair du formulaire
            const hash = await hashPassword(password);
            if (!hash) {
                logger.error("Un problème est survenu lors du hash");
                return APIResponse(
                    response,
                    null,
                    "Un problème est survenu lors du hash",
                    500,
                );
            }

            // On ajoute le new user dans la db avec le mdp hashé
            const [updatedUser] = await usersModel.update(id, {
                name,
                email,
                password: hash,
            });
            if (!updatedUser) {
                logger.error("Un problème est survenu lors de la création");
                return APIResponse(
                    response,
                    null,
                    "Un problème est survenu lors de la création",
                    500,
                );
            }

            APIResponse(response, null, "Utilisateur mis à jour", 200);
        } catch (error: any) {
            logger.error(
                "Erreur lors de la mise à jour de l'utilisateur: ",
                error,
            );
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
                "Erreur lors de la mise à jour de l'utilisateur",
                500,
            );
        }
    },
    delete: async (request: Request, response: Response) => {
        try {
            const { id } = request.params;

            logger.info(`[DELETE] Supprimer l'user avec l'id: ${id}`);

            const user = await usersModel.get(id);
            if (!user) {
                logger.error("User inexistant");
                return APIResponse(response, null, "User inexistant", 404);
            }

            await usersModel.delete(id);

            // Si l'utilisateur N'EST PAS admin, il doit être déconnecté
            if (!response.locals.user.isAdmin) {
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
                "Erreur lors de la suppression de l'utilisateur: ",
                error,
            );
            APIResponse(
                response,
                null,
                "Erreur lors de la suppression de l'utilisateur",
                500,
            );
        }
    },
};
