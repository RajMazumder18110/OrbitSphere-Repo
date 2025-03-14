/** @notice Library imports */
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "@orbitsphere/database/schemas";
/// Local imports
import { DATABASE_CONNECTION_URL } from "@/constants";

export const database = drizzle(DATABASE_CONNECTION_URL, { schema });
