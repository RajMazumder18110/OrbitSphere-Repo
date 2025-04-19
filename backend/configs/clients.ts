/** @notice Library imports */
import { OrbitSphere } from "@orbitsphere/blockchain";
import { OrbitSphereAWSInstance } from "@orbitsphere/aws";
import { createOrbitSphereLogger } from "@orbitsphere/logger";
import { TerminationScheduler } from "@orbitsphere/scheduler";
import { OrbitSphereDatabase } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";

/// Scheduler
export const terminationScheduler = new TerminationScheduler();

/// AWS
export const orbitsphereAWS = new OrbitSphereAWSInstance(
  environment.AWS_ACCESS_KEY_ID,
  environment.AWS_SECRET_ACCESS_KEY
);

/// Logger
export const logger = createOrbitSphereLogger("OrbitSphere");

/// OrbitSphere contract
export const orbitsphere = new OrbitSphere(
  environment.ORBIT_SPHERE_CONTRACT,
  environment.BLOCKCHAIN_RPC_ENDPOINT
);

/// Handlers
export const orbitSphereDatabase = new OrbitSphereDatabase(
  environment.DATABASE_CONNECTION_URL
);
