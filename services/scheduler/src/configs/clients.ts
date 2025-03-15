/** @notice Library imports */
import {
  RentalMessageConsumer,
  TerminationMessageConsumer,
} from "@orbitsphere/broker";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
/// Local imports
import { environment } from "./environments";
import { TerminationScheduler } from "@orbitsphere/scheduler";
import { OrbitSphere } from "@orbitsphere/blockchain";

/// Logger
export const logger = createOrbitSphereLogger("scheduler");

/// Scheduler
export const terminationScheduler = new TerminationScheduler();

/// Blockchain
export const orbitsphereContract = new OrbitSphere(
  environment.ORBIT_SPHERE_CONTRACT,
  environment.BLOCKCHAIN_RPC_ENDPOINT
);

/// Queues
export const terminationConsumer = new TerminationMessageConsumer(
  "@orbitsphere-termination-scheduler",
  [environment.KAFKA_CONNECTION_URL],
  "termination-scheduler-group-1"
);
export const rentalConsumer = new RentalMessageConsumer(
  "@orbitsphere-termination-scheduler",
  [environment.KAFKA_CONNECTION_URL],
  "termination-scheduler-group-1"
);
await rentalConsumer.connect();
