import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const suppliers = mysqlTable("suppliers", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    userId: varchar("id_users", { length: 36 }).references(() => users.id, { onDelete: "cascade"}).notNull(),
});
