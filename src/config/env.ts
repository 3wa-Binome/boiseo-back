import dotenv from "dotenv";
import { EnvConfig } from "../types/env";

dotenv.config();

export const env: EnvConfig = {
    PORT: parseInt(process.env.PORT || "3000"),
    NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
    ORIGIN: process.env.ORIGIN || "http://localhost:5173",
    DATABASE_URL: process.env.DATABASE_URL || "postgresql://postgres:admin@localhost:5432/blog",
    JWT_SECRET: process.env.JWT_SECRET || "SecretTresBienGardeNePasDivulgerPubliquement",
}