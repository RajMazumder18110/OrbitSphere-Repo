/** @notice Library imports */
import { OrbitSphere } from "@orbitsphere/orbiter";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
import {
  OrbitSphereRentalQueue,
  OrbitSphereTerminationQueue,
} from "@orbitsphere/queues";
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

/// Queues
export const orbitsphereRentalQueue = new OrbitSphereRentalQueue();
export const orbitSphereTerminationQueue = new OrbitSphereTerminationQueue();
await orbitsphereRentalQueue.initialize(environment.RABBITMQ_CONNECTION_URL);
await orbitSphereTerminationQueue.initialize(
  environment.RABBITMQ_CONNECTION_URL
);
