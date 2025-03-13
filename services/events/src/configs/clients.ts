/** @notice Library imports */
import { OrbitSphere } from "@orbitsphere/orbiter";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
import {
  RentalMessageProducer,
  TerminationMessageProducer,
} from "@orbitsphere/broker";
/// Local imports
import { environment } from "./environments";

/// Logger
export const logger = createOrbitSphereLogger("events");

/// OrbitSphere contract
export const orbitsphere = new OrbitSphere(
  environment.ORBIT_SPHERE_CONTRACT,
  environment.BLOCKCHAIN_RPC_ENDPOINT
);

/// Handlers
export const orbitSphereDatabase = new OrbitSphereDatabase(
  OrbitSphereDatabase.databaseUrl
);

/// Messaging brokers
export const orbitsphereRentalEventProducer = new RentalMessageProducer(
  "@orbitsphere-events",
  [environment.KAFKA_CONNECTION_URL]
);
export const orbitSphereTerminationEventProducer =
  new TerminationMessageProducer("@orbitsphere-events", [
    environment.KAFKA_CONNECTION_URL,
  ]);

await orbitsphereRentalEventProducer.connect();
await orbitSphereTerminationEventProducer.connect();
