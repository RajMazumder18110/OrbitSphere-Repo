/** @notice Library imports */
import OrbitSphereAWSInstance from "@orbitsphere/aws";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereTerminationQueue } from "@orbitsphere/queues";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";
import { TerminationMessageConsumer } from "@orbitsphere/broker";

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
export const orbitSphereTerminationConsumer = new TerminationMessageConsumer(
  "@orbitsphere-terminator",
  [environment.KAFKA_CONNECTION_URL],
  "terminator-group-1"
);
await orbitSphereTerminationConsumer.connect();
