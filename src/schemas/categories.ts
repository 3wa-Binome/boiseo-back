import { mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";
import { randomUUID } from "crypto";
import { users } from "./users";

export const categories = mysqlTable("categories", {
    id: varchar("id", { length: 36 })
        .primaryKey()
        .notNull()
        .$defaultFn(() => randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    userId: varchar("id_users", { length: 36 }).references(() => users.id, { onDelete: "cascade"}).notNull(),
});
