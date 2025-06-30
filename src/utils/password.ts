import argon2 from "argon2";
import { logger } from "./";

//Hash d'un password
export const hashPassword = async (password: string): Promise<string> => {
    try {
        const hash = await argon2.hash(password);
        return hash;
    } catch (err: any) {
        logger.error("Erreur lors du hash du mot de passe: " + err.message);
        throw new Error("Erreur lors du hash du mot de passe");
    }
}

// Vérification mot de passe
export const verifyPassword = async (password: string, hash: string): Promise<Boolean> => {
    try {
        const verify = await argon2.verify(hash, password);  
        return verify;
    } catch (err: any) {
        logger.error("Erreur lors de la vérification du mot de passe: " + err.message);
        throw new Error("Erreur lors de la vérification du mot de passe");
    }
}
