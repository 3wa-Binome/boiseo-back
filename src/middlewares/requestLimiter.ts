import { NextFunction, Request, Response } from "express";
import { logger, APIResponse } from "../utils";
import rateLimit from "express-rate-limit";

export const requestLimiter = (limit: number) => {

    const limiter = rateLimit({
        windowMs: 60 * 60 * 1000, // 1 heure
        max: limit, // Utilisation du paramètre `limit`
        message: "Trop de tentatives de réinitialisation. Réessayez plus tard.",
        headers: true,
    });

    return async (request: Request, response: Response, next: NextFunction) => {
        logger.info("[MIDDLEWARE] : requestLimiter")

        try {
            limiter(request, response, (err) => {
                if (err) {
                    logger.error("Limite de requêtes atteinte", err);
                    return APIResponse(response, null, "Trop de tentatives", 429);
                }
                next();
            });
        } catch (error: any) {
            logger.error("Token invalide", error);
            return APIResponse(response, null, "Token invalide", 401);
        }
    }
};