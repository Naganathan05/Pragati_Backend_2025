import "dotenv/config.js";
import { appConfig } from "./config/config.js";
import { validateEnv } from "./utilities/envValidator.js";

// Imports for Express, CORS, Helmet
import express, { json } from "express";
import cors from "cors";
import helmet from "helmet";

// Importing swagger UI for API documentation and setting things up
import { serve, setup } from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Pragati 2025 API Documentation",
            version: "1.0.0",
            description: "Comprehensive API docs of Pragati 2025",
        },
    },
    apis: ["./routes/*.js"], // Path to your API docs or comments in route files
};

// Multi-Processing.
import cluster from "cluster";

// Import existsSync for checking the presence of privateKey and publicKey
import { existsSync } from "fs";

// Import generateKey for RSA Encryption Key Generation
import { generateKey } from "./utilities/RSA/generateKey.js";

// Imports for database initialization
import initDatabase from "./db/schema/initDatabase.js";

// import function to create log directories.
import { initLog } from "./utilities/logInit.js";

// import router for API routing
import router from "./routes/mainRoute.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(json());

// test endpoint for checking the availability of server
app.get("/api/test", (req, res) => {
    return res.status(200).json({ MESSAGE: "Server is running ◪_◪" });
});

// using routes extending the '/api' path
app.use("/api", router);

// endpoint for accessing API docs
app.use("/docs", serve, setup(swaggerJSDoc(swaggerOptions)));

if (cluster.isPrimary) {
    console.info(`[LOG]: Parent ${process.pid} is Running.`);

    // Validate the environment variables.
    if (!validateEnv()) {
        console.error("[ERROR]: env varaiables validator failed!!");
        process.exit(1);
    }

    // Initialize the log directories.
    initLog();

    // Initialize the database with the schema.
    try {
        await initDatabase(appConfig.db.pragati.database);
        await initDatabase(appConfig.db.transactions.database);
    } catch (err) {
        console.error(`[ERROR]: Error in Initializing Database.`);
        console.error(err);
        process.exit(1);
    }

    if (
        !existsSync("./middleware/encryptionKeys/privateKey.pem") ||
        !existsSync("./middleware/encryptionKeys/publicKey.pem")
    ) {
        await generateKey();
    }

    // Fork the processes.
    console.log(`[LOG]: Forking ${appConfig.numCPU} Processes.`);
    for (let i = 0; i < appConfig.numCPU; i++) {
        cluster.fork();
    }

    // If a worker dies, fork a new one.
    cluster.on("exit", (worker, code, signal) => {
        console.info(
            "Worker with PID: %d Died (%s). Restarting...",
            worker.process.pid,
            signal || code,
        );
        cluster.fork();
    });
} else {
    app.listen(appConfig.PORT, (err) => {
        if (err) {
            console.error(`[ERROR]: Error in Starting Server !!`, err);
            process.exit(1);
        } else {
            console.info(
                `[LOG]: Server ${process.pid} Listening in Port ${appConfig.PORT}`,
            );
        }
    });
}
