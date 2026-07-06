import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 3001),
  jwtSecret: process.env.JWT_SECRET ?? "webquest-dev-secret",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:5173",
};
