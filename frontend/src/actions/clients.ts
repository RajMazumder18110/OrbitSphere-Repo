/** @notice Library imports */
import { OrbitSphereAWSInstance } from "@orbitsphere/aws";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import {
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  DATABASE_CONNECTION_URL,
} from "@/constants";

/// Clients
export const database = new OrbitSphereDatabase(DATABASE_CONNECTION_URL);
export const aws = new OrbitSphereAWSInstance(
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY
);
