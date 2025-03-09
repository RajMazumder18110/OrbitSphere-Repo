/** @notice Library imports */
import OrbitSphereAWSInstance from "@orbitsphere/aws";
import { OrbitSphereRentalQueue } from "@orbitsphere/queues";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";

/// Logger
export const logger = createOrbitSphereLogger("events");

/// Database
export const orbitSphereDatabase = new OrbitSphereDatabase(
  OrbitSphereDatabase.databaseUrl
);

/// AWS
export const orbitsphereAWS = new OrbitSphereAWSInstance(
  environment.AWS_ACCESS_KEY_ID,
  environment.AWS_SECRET_ACCESS_KEY
);

/// Queues
export const orbitsphereRentalQueue = new OrbitSphereRentalQueue();
await orbitsphereRentalQueue.initialize(environment.RABBITMQ_CONNECTION_URL);
