/** @notice Library imports */
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./migrations",
  schema: "./packages/database/src/schemas/index.ts",
  dialect: "postgresql",
  dbCredentials: {
    ssl: false,
    url: process.env.DATABASE_CONNECTION_URL,
  },
});
