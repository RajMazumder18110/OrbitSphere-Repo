/** @notice Library imports */
import OrbitSphereAWSInstance from "@orbitsphere/aws";
import { OrbitSphereTerminationQueue } from "@orbitsphere/queues";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";

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
export const orbitSphereTerminationQueue = new OrbitSphereTerminationQueue();
await orbitSphereTerminationQueue.initialize(
  environment.RABBITMQ_CONNETION_URL
);
