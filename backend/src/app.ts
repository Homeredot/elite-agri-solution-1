import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.js";
import { apiRouter } from "./routes/index.js";
import { getUploadRootDir } from "./utils/uploads.js";

export const app = express();

const allowedOrigins = Array.from(
  new Set([env.FRONTEND_URL, "http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174"])
);

app.use(
  cors({
    origin: (origin, callback) => {
      if (origin) {
        console.log("CORS request from origin:", origin);
      }
      // Allow all origins for development
      callback(null, true);
    },
    credentials: true
  })
);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  "/api/auth",
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.use("/uploads", express.static(getUploadRootDir()));
app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});
app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
