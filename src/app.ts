import express, { Express } from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import { getHelmetConfig } from "../config/helmetConfig";
import cors from "cors";
import { getCorsOptions } from "../config/corsConfig";

// Load environment variables BEFORE your internal imports!
dotenv.config();

import setupSwagger from "../config/swagger";
import reviewRoutes from "./api/v1/routes/reviewRoutes";
import commentRoutes from "./api/v1/routes/commentRoute";
import categoryRoutes from "./api/v1/routes/categoryRoutes";
import errorHandler from "./api/v1/middleware/errorHandler";
import {
    accessLogger,
    errorLogger,
    consoleLogger,
} from "./api/v1/middleware/logger";

// Initialize Express application
const app: Express = express();

// Apply Helmet's security headers
app.use(helmet());
app.use(getHelmetConfig());
app.use(cors());
app.use(cors(getCorsOptions()));

// Interface for health check response
// An interface in TypeScript defines the structure or "shape" of an object.
interface HealthCheckResponse {
    status: string;
    uptime: number;
    timestamp: string;
    version: string;
}
// Middleware START

app.use(accessLogger);
app.use(errorLogger);
app.use(consoleLogger);

// Ensures incoming body is correctly parsed to JSON, otherwise req.body would be undefined
app.use(express.json());

// Middleware END

// respond to GET request at endpoint "/" with message
app.get("/", (req, res) => {
    res.send("Hello, World!");
});

/**
 * Health check endpoint that returns server status information
 * @returns JSON response with server health metrics
 */
app.get("/api/v1/health", (req, res) => {
    const healthData: HealthCheckResponse = {
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    };

    res.json(healthData);
});

// Route Imports START
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/comments", commentRoutes);
app.use("/api/v1/categories", categoryRoutes);

// Route Imports END

// Setup Swagger
setupSwagger(app);

// needs to be used last
app.use(errorHandler);

export default app;