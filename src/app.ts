// import the express application and type definition
import express, { Express } from "express";

// Importing morgan for logging
import morgan from "morgan"; 

// import employeeRoutes
import employeeRoutes from "./api/v1/routes/employeeRoutes";

// import branchRoutes
import branchRoutes from "./api/v1/routes/branchRoutes";

// initialize the express application
const app: Express = express();

// Middleware START
// Use Morgan for HTTP request logging
app.use(morgan("combined"));

// Ensures incoming body is correctly parsed to JSON, otherwise req.body would be undefined
app.use(express.json());

// Middleware END

// respond to GET request at endpoint "/" with message
app.get("/", (_req, res) => {
    res.send("Hello, world!");
});

app.use('/api/v1/employees', employeeRoutes);
app.use('/api/v1/branches', branchRoutes);

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