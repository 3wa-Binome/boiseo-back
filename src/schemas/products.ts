import { mysqlTable, text, timestamp, varchar, int } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { users, categories } from "./";

export const products = mysqlTable("products", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    quantity: int("quantity").notNull().default(0),
    createdAt: timestamp("created_at").defaultNow(),
    userId: varchar("id_users", { length: 36 }).references(() => users.id, { onDelete: "cascade"}).notNull(),
    categoryId: varchar("id_categories", { length: 36 }).references(() => categories.id, { onDelete: "restrict"}).notNull(),
});