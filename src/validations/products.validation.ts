import { z } from "zod";

export const productsValidation = z.object({
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
    categoryId: z.string()
        .uuid({ message: "L'ID de la catégorie doit être un UUID valide" }),
    materials: z.array(
        z.object({
            materialId: z.string()
                .uuid({ message: "L'ID du matériau doit être un UUID valide" }),
            quantity: z.number()
                .int({ message: "La quantité doit être un entier" })
                .min(0, { message: "La quantité ne peut pas être négative" }),
        }),
    ),
});

export const productsQuantityValidation = z.object({
    quantity: z.number().int(),
});
