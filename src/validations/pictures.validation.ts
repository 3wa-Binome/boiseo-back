import { z } from "zod";

export const picturesValidation = z.object({
    src: z.string()
        .trim()
        .min(1, { message: "Le nom est requis" })
        .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
    productId: z.string()
        .uuid({ message: "L'ID du produit doit être un UUID valide" })
        .optional()
})