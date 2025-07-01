import { z } from "zod";

export const userRegisterValidation = z.object({
    name: z.string()
        .trim()
        .min(1, { message: "Le nom est requis" })
        .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
    email: z.string()
        .trim()
        .email({ message: "Adresse email invalide" })
        .max(255, { message: "L'email ne doit pas dépasser 255 caractères" }),
    password: z.string()
        .trim()
        .min(6, { message: "Votre mot de passe doit contenir au moins 6 caractères"})
        .max(255, { message: "Le mot de passe ne doit pas dépasser 255 caractères" })
        .regex(/[0-9]/, { message: "Votre mot de passe doit contenir au moins un chiffre" })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Votre mot de passe doit contenir au moins un caractère spécial" }),
    confirmPassword: z.string()
        .trim()
        .min(6, { message: "Votre mot de passe doit contenir au moins 6 caractères"})
        .max(255, { message: "Le mot de passe ne doit pas dépasser 255 caractères" })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe doivent être identiques.", 
    path:["confirmPassword"]
});

export const emailValidation = z.object({
    email: z.string()
        .trim()
        .email({ message: "Adresse email invalide" })
        .max(255, { message: "L'email ne doit pas dépasser 255 caractères" }),
});