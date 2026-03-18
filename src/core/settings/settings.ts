import dotenv from "dotenv";

dotenv.config();

export const SETTINGS = {
  PORT: process.env.PORT ?? 3001,
  MONGO_URL: process.env.MONGO_URL ?? "",
  DB_NAME: process.env.DB_NAME ?? "test",
  JWT_SECRET: process.env.JWT_SECRET ?? "jwt_secret",
  EMAIL: process.env.EMAIL ?? "",
  EMAIL_PASS: process.env.EMAIL_PASS ?? "",
};
