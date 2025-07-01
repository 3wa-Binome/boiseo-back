import { z } from "zod";

export const materialsValidation = z.object({
    name: z.string()
        .trim()
        .min(1, { message: "Le nom est requis" })
        .max(255, { message: "Le nom ne doit pas dépasser 255 caractères" }),
    description: z.string()
        .trim()
        .min(1, { message: "La description est requise" }),
    supplierId: z.string()
        .uuid({ message: "L'ID du fournisseur doit être un UUID valide" })
})