import { Request, Response } from "express";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

import { APIResponse, logger, hashPassword, verifyPassword } from "../utils";
import { usersModel } from "../models";

import { userRegisterValidation } from "../validations";
import { z } from "zod";

const { JWT_SECRET, NODE_ENV } = env;

export const authController = {
    login: async (request: Request, response: Response) => {
        try {
            logger.info("[AUTH] Login") // Log d'information en couleur

            const { email, password } = request.body;
            const [ user ] = await usersModel.findByCredentials(email);
            if (!user) {
                return APIResponse(response, null, "Les identifiants saisis sont incorrects", 400);
            }

            // vérification mot de passe hashé
            const validPassword = await verifyPassword(password, user.password);
            if (!validPassword)
                return APIResponse(response, null, "Les identifiants saisis sont incorrects", 400);
            // En dessous, on admet que le mot de passe saisit est le bon !

            const userTokenData = { id: user.id, name: user.name }

            // generation du jwt
            const accessToken = jwt.sign(userTokenData, JWT_SECRET, { expiresIn: '1h' })

            response.cookie('accessToken', accessToken, {
                httpOnly: true, // true - cookie réservé uniquement pour communication HTTP - pas accessible en js
                sameSite: 'none', // protection CSRF
                secure: NODE_ENV === "production" || NODE_ENV === "development" // le cookie ne sera envoyé que sur du HTTPS uniquement en prod
            });
            APIResponse(response, userTokenData, "Vous êtes bien connecté", 200);
        } catch (error: any) {
            logger.error("Erreur lors de la connexion de l'utilisateur:", error);
            APIResponse(response, null, "Erreur serveur", 500);
        }
    },
    register: async (request: Request, response: Response) => {
        try {
            logger.info("[AUTH] Register") // Log d'information en couleur
            const { name, email, password } = userRegisterValidation.parse(request.body);

            // on vérifie qu'un user n'a pas déjà cet adresse email
            const [ emailAlreadyExists ] = await usersModel.findByCredentials(email);
            if (emailAlreadyExists) {
                logger.error("Cette adresse email est déjà utilisée")
                return APIResponse(response, null, "Cette adresse email est déjà utilisée", 400);
            }

            // On hash le mot de passe en clair du formulaire
            const hash = await hashPassword(password);
            if (!hash) {
                logger.error("Un problème est survenu lors du hash")
                return APIResponse(response, null, "Un problème est survenu lors du hash", 500);
            }

            // On ajoute le new user dans la db avec le mdp hashé
            const [ newUser ] = await usersModel.create({ name, email, password: hash })
            if (!newUser) {
                logger.error("Un problème est survenu lors de la création");
                return APIResponse(response, null, "Un problème est survenu lors de la création", 500);
            }
                
            APIResponse(response, null, "Vous êtes inscrit", 200);
        } catch (error: any) {
            logger.error("Erreur lors de l'inscription de l'utilisateur:", error);
            if (error instanceof z.ZodError) {
                return APIResponse(response, error.errors, "Le formulaire est invalide", 400);
            }
            APIResponse(response, null, "Erreur serveur", 500);
        }
    },
    logout: async (request: Request, response: Response) => {
        logger.info("[AUTH] Logout") // Log d'information en couleur
        response.clearCookie("accessToken");
        APIResponse(response, null, "Vous êtes déconnecté", 200);
    },
    checkConnexion : (request: Request, response: Response) => {
        const { user } = response.locals;
        APIResponse(response, user, "Vous êtes bien connectée", 200);
    }
}