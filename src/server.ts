import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { requestLogger } from "./middlewares";
import { env } from "./config/env";
import router from "./routes";

// Initialise notre app express
const app = express();
const { PORT, ORIGIN } = env;

app.use(cors({
    origin: ORIGIN, // Autoriser UNIQUEMENT cette adresse à requêter sur mon serv
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'], // Méthodes HTTPS autorisées (les autres seront bloquées)
    credentials: true
}));
app.use(cookieParser()); // traiter correctement avec les cookies
app.use(express.json()); // pour analyser les requêtes JSON
app.use(express.urlencoded({ extended: true }))
app.use(requestLogger);

// Notre router global, situé dans src/routes/index.ts
app.use("/", router);

app.listen(PORT, () => { // Mise en écoute du serveur (met le serveur en écoute sur le port spécifié et affiche un message à la console quand c'est prêt)
    console.log("Le serveur est en écoute sur: http://localhost:" + PORT);
})