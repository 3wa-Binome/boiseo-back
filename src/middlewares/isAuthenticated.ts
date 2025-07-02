import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { logger, APIResponse } from "../utils";

const { JWT_SECRET } = env;

export const isAuthenticated = (isExpected: boolean) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        logger.info("[MIDDLEWARE] : isAuthenticated")
        const { accessToken } = request.cookies; // on récupére le cookie "accessToken" qui contient le JWT
        if (!accessToken) {
            // Si nous avons besoin de ne pas être identifié (ex: login, register,..)
            if (!isExpected) {
                return next();
            }
            // Sinon
            return APIResponse(response, null, "Vous devez être connecté", 401);
        } else {
            // Si nous avons besoin de ne pas être identifié (ex: login, register,..)
            if (!isExpected) {
                logger.error("Vous devez être déconnecté");
                return APIResponse(
                    response,
                    null,
                    "Vous devez être déconnecté",
                    401,
                );
            }
            // Sinon
            try {
                const decoded = jwt.verify(accessToken, JWT_SECRET);
                // en dessous, c'est que verify est bien passé correctement !
                response.locals.user = decoded;

                next();

            } catch (error: any) {
                logger.error("Token invalide", error);
                return APIResponse(response, null, "Token invalide", 401);
            }
        }
    };
};
