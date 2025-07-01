import { db } from "../config/pool";
import { NextFunction, Request, Response } from "express";
import { APIResponse } from "../utils/response";
import { MySqlTableWithColumns } from 'drizzle-orm/mysql-core';
import { and, eq, or } from "drizzle-orm";
import { logger } from "../utils";
import { users } from "../schemas";

export const isOwner = (schema: MySqlTableWithColumns<any>) => {
    return async (request: Request, response: Response, next: NextFunction) => {
        try {
            logger.info("[MIDDLEWARE] : isOwner");
            const { user } = response.locals;

            const { id } = request.params;

            const [owner] = await db.select({ id: schema.id }).from(schema)
                .where(
                    and(

                        eq(
                            schema === users
                                ? schema.id // Si le schéma est users, nous devons vérifier si le user connecté est bien le user recherché (user.id)
                                : schema.userId,
                            user.id,
                        ),
                        eq(schema.id, id),
                    ),
                );

            if (!owner) throw new Error();
            return next();
            
        } catch (error: any) {
            logger.error("Droits invalides", error);
            return APIResponse(response, null, "Droits invalides", 403);
        }
    };
};
