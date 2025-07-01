import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { users, products } from "./";

export const pictures = mysqlTable("pictures", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    src: varchar("src", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    userId: varchar("id_users", { length: 36 }).references(() => users.id, {
        onDelete: "cascade",
    }).notNull(),
    productId: varchar("id_products", { length: 36 }).references(() => products.id, {
        onDelete: "cascade",
    }),
});
