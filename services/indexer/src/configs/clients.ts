/** @notice Library imports */
import { OrbitSphere } from "@orbitsphere/blockchain";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
import {
  RentalMessageProducer,
  TerminationMessageProducer,
} from "@orbitsphere/broker";
/// Local imports
import { environment } from "./environments";

/// Logger
export const logger = createOrbitSphereLogger("indexer");

/// OrbitSphere contract
export const orbitsphere = new OrbitSphere(
  environment.ORBIT_SPHERE_CONTRACT,
  environment.BLOCKCHAIN_RPC_ENDPOINT
);

/// Handlers
export const orbitSphereDatabase = new OrbitSphereDatabase(
  environment.DATABASE_CONNECTION_URL
);

/// Messaging brokers
export const orbitsphereRentalEventProducer = new RentalMessageProducer(
  "@orbitsphere-indexer",
  [environment.KAFKA_CONNECTION_URL]
);
export const orbitSphereTerminationEventProducer =
  new TerminationMessageProducer("@orbitsphere-indexer", [
    environment.KAFKA_CONNECTION_URL,
  ]);

await orbitsphereRentalEventProducer.connect();
await orbitSphereTerminationEventProducer.connect();
