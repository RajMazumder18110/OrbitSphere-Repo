/** @notice Library imports */
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@orbitsphere/database/schemas";

export const database = drizzle(
  "postgres://postgres:orbitsphere@localhost:5432/OrbitSphere",
  { schema }
);
