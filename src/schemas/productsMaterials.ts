import { int, mysqlTable, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { materials, products } from "./";

export const productsMaterials = mysqlTable("products_materials", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    productId: varchar("product_id", { length: 36 })
        .notNull()
        .references(() => products.id, { onDelete: "cascade" }),
    materialId: varchar("material_id", { length: 36 })
        .notNull()
        .references(() => materials.id, { onDelete: "cascade" }),
    quantity: int("quantity").notNull(),
});
