// import the express application and type definition
import express, { Express } from "express";

// Importing morgan for logging
import morgan from "morgan"; 

// import itemRoutes
import itemRoutes from "./api/v1/routes/itemRoutes";

// initialize the express application
const app: Express = express();

// Use Morgan for HTTP request logging
app.use(morgan("combined"));

// respond to GET request at endpoint "/" with message
app.get("/", (_req, res) => {
    res.send("Hello, world!");
});

app.use('/api/v1/items', itemRoutes);

app.get("/api/v1/health", (_req, res) => {
    res.json({
        status: "OK",
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});

// export app and server for testing
export default app;