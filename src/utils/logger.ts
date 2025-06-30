import { createLogger, format, transports } from "winston";

export const logger = createLogger({
    level: "info", // niveau de log min pour capturer (peut etre info warn debug error etc)
    format: format.combine(
        format.colorize(), // Colorise le niveau de log en fct de sa gravité (level)
        format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }), // Ajoute un timestamp formaté à chaque log
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] - [${level}]: ${message}` // Format custom pour afficher le log
        })
    ),
    transports: [
        new transports.Console(), // Affiche les logs sur la console en couleur
        new transports.File({ filename: "logs/error.log", level: "error" }), // Fichier de log où seront ttes les error
        new transports.File({ filename: "logs/combined.log" }) // Fichier où seront TOUT les logs (sans exception)
    ]
});