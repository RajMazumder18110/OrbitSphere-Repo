/** @notice Library imports */
import OrbitSphereAWSInstance from "@orbitsphere/aws";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";
import { RentalMessageConsumer } from "@orbitsphere/broker";

/// Logger
export const logger = createOrbitSphereLogger("provisioner");

/// Database
export const orbitSphereDatabase = new OrbitSphereDatabase(
  environment.DATABASE_CONNECTION_URL
);

/// AWS
export const orbitsphereAWS = new OrbitSphereAWSInstance(
  environment.AWS_ACCESS_KEY_ID,
  environment.AWS_SECRET_ACCESS_KEY
);

/// Queues
export const orbitsphereRentalConsumer = new RentalMessageConsumer(
  "@orbitsphere-provisioner",
  [environment.KAFKA_CONNECTION_URL],
  "provision-group-1"
);
await orbitsphereRentalConsumer.connect();
