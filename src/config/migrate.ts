// ce fichier est UNIQUEMENT appelé dans le term (via package.json)
// **JAMAIS** utilisé dans la codebase


import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";

import { env } from "./env";
const { DATABASE_URL } = env;

async function main() {
    // Crée un pool de connexions MySQL
    const pool = mysql.createPool({
        uri: DATABASE_URL,
        connectionLimit: 10, // tu peux ajuster selon ton besoin
    });

    const db = drizzle(pool);

    console.log("Migrating database...");

    await migrate(db, { migrationsFolder: "src/migrations" });

    console.log("Database migrated successfully!");

    await pool.end();
}

main();
