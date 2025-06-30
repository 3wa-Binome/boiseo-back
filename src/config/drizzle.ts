// On importe notre config d'env; pour lire ces env var
import 'dotenv/config';

// le type de configuration du package drizzle-kit définira la structure de notre configuration drizzle
import { defineConfig } from "drizzle-kit"

import { env } from './env';
const { DATABASE_URL } = env;

export default defineConfig({
    // On indique à drizzle quel driver utiliser pour se connecter à la DB
    dialect: "mysql",

    // On va indiquer où drizzle va générer les fichiers de migrations, journal et autre meta
    out: "src/migrations",

    // indique à drizzle où se trouve le fichier comportant toutes les définitions des schémas
    schema: "src/schemas/index.ts",

    // les credentials de connexion à la db
    dbCredentials: {
        url: DATABASE_URL
    },

    // On est toujours sur du TS bien typesafe etc etc
    verbose: true,
    strict: true
})