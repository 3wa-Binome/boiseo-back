import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "./env";
import * as schema from "../schemas";

const { DATABASE_URL } = env;

const pool = mysql.createPool({ uri: DATABASE_URL });

export const db = drizzle(pool, { schema, mode: "default" });