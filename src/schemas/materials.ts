import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { users } from "./users";
import { suppliers } from "./suppliers";

export const materials = mysqlTable("materials", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    supplierId: varchar("id", { length: 36 }).references(() => suppliers.id, { onDelete: "cascade"}).notNull(),
    userId: varchar("id", { length: 36 }).references(() => users.id, { onDelete: "cascade"}).notNull(),
});