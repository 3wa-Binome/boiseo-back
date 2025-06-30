import { Request, Response } from "express";
import { APIResponse, hashPassword, logger, verifyPassword } from "../utils";
import { userModel } from "../models";

export const usersController = {
    getAll: async (request: Request, response: Response) => {
        try {
            logger.info("[GET] Récupérer tous les users");
            const users = await userModel.getAll();
            APIResponse(response, users, "OK");

        } catch (error: any) {
            logger.error("Erreur lors de la récupération des users: ", error);
            APIResponse(response, null, "Erreur lors de la récupération des users", 500);
        }
    },
};