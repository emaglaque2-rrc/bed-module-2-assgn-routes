// import the express application and type definition
import express, { Express } from "express";

// import itemRoutes
import itemRoutes from "./api/v1/routes/itemRoutes";

// initialize the express application
const app: Express = express();

// respond to GET request at endpoint "/" with message
app.get("/", (_req, res) => {
    res.send("Hello, world!");
});

app.use('/api/v1/items', itemRoutes);

// export app and server for testing
export default app;