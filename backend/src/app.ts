import express from "express";
import helmet from "helmet";
import imagesRoutes from "./routes/images.routes";
import { corsMiddleware } from "./middleware/cors";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json());

app.use("/api", imagesRoutes);

app.use(errorHandler);

export default app;
