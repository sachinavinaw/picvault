import pino from "pino";
import { env } from "../config/env";

const transport =
  env.NODE_ENV === "production"
    ? undefined
    : pino.transport({
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss.l o",
          ignore: "pid,hostname",
          singleLine: true,
        },
      });

const logger = pino(
  {
    level: env.NODE_ENV === "production" ? "info" : "debug",
    base: { pid: false },
    timestamp: pino.stdTimeFunctions.isoTime,
  },
  transport,
);

export default logger;
