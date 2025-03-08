/** @notice Library imports */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./packages/database/src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    user: process.env.POSTGRES_USER!,
    host: process.env.POSTGRES_HOST!,
    database: process.env.POSTGRES_DB!,
    password: process.env.POSTGRES_PASSWORD!,
    port: Number(process.env.POSTGRES_PORT!),
    ssl: false,
  },
});
