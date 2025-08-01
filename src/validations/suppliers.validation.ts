import { z } from "zod";

export const suppliersValidation = z.object({
    name: z.string()
        .trim()
        .min(1, { message: "Le nom est requis" })
        .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
    description: z.string()
        .trim()
        .min(1, { message: "La description est requise" })
        .max(2000, {
            message: "La description ne doit pas dépasser 2000 caractères",
        }),
});
