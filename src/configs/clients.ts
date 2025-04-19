/** @notice Library imports */
import { OrbitSphereDatabase } from "../database/handlers";
/// Local imports
import { environment } from "./environments";
import { createOrbitSphereLogger } from "./logger";
import { OrbitSphere } from "../services/OrbitSphere";
import OrbitSphereAWSInstance from "../services/OrbitSphereAWSInstance";
import { TerminationScheduler } from "../services/TerminationScheduler";

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
