import express from "express";
import cors from "cors";
import router from "./routes/index.route.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js"

/**
 * Express application instance.
 * Configured with CORS and JSON body parsing.
 */
const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
