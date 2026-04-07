import express from "express";
import helmet from "helmet";
import imagesRoutes from "./routes/images.routes";
import { corsMiddleware } from "./middleware/cors";
import { apiRateLimiter } from "./middleware/rateLimiter";
import { errorHandler } from "./middleware/errorHandler";
import logger from "./utils/logger";

const app = express();

app.use(helmet());
app.use(corsMiddleware);
app.use(apiRateLimiter);
app.use(express.json());

app.use((req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`,
    );
  });

  next();
});

app.use("/api", imagesRoutes);

app.use(errorHandler);

export default app;
