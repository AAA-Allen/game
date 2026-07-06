import cors from "cors";
import express from "express";

import { env } from "./config/env";
import { errorHandler } from "./middlewares/error-handler";
import { notFoundHandler } from "./middlewares/not-found";
import { apiRouter } from "./routes";
import { sendSuccess } from "./utils/api-response";

export const app = express();

app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  }),
);
app.use(express.json());

app.get("/health", (_req, res) => {
  return sendSuccess(
    res,
    {
      status: "ok",
      service: "webquest-server",
    },
    "health check success",
  );
});

app.use("/api", apiRouter);
app.use(notFoundHandler);
app.use(errorHandler);
