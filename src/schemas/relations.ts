import { relations } from "drizzle-orm";
import {
    categories,
    pictures,
    materials,
    productsMaterials,
    suppliers,
    users,
    products,
} from "./";

export const usersRelations = relations(users, ({ many }) => ({
    categories: many(categories),
    products: many(products),
    materials: many(materials),
    suppliers: many(suppliers),
    pictures: many(pictures)
}));

export const suppliersRelations = relations(suppliers, ({ many, one }) => ({
    materials: many(materials),
    user: one(users, {
        fields: [suppliers.userId],
        references: [users.id]
    })
}));

export const categoriesRelations = relations(categories, ({ many, one }) => ({
    products: many(products),
    user: one(users, {
        fields: [categories.userId],
        references: [users.id]
    })
}));

export const materialsRelations = relations(materials, ({ many, one }) => ({
    productsMaterials: many(productsMaterials),
    user: one(users, {
        fields: [materials.userId],
        references: [users.id]
    }),
    supplier: one(suppliers, {
        fields: [materials.supplierId],
        references: [suppliers.id]
    }),
}));

export const productsMaterialsRelations = relations(productsMaterials, ({ many, one }) => ({
    pictures: many(pictures),
    material: one(materials, {
        fields: [productsMaterials.materialId],
        references: [materials.id]
    }),
    product: one(products, {
        fields: [productsMaterials.productId],
        references: [products.id]
    }),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
    productsMaterials: many(productsMaterials),
    user: one(users, {
        fields: [products.userId],
        references: [users.id]
    }),
    category: one(categories, {
        fields: [products.categoryId],
        references: [categories.id]
    }),
}));

export const picturesRelations = relations(pictures, ({ one }) => ({
    user: one(users, {
        fields: [pictures.userId],
        references: [users.id]
    }),
    product: one(products, {
        fields: [pictures.productId],
        references: [products.id]
    }),
}));