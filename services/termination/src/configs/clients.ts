/** @notice Library imports */
import { OrbitSphere } from "@orbitsphere/orbiter";
import { OrbitSphereEventsHandler } from "@orbitsphere/database/handlers";
/// Local imports
import { environment } from "./environments";

/// OrbitSphere contract
export const orbitsphere = new OrbitSphere(
  environment.ORBIT_SPHERE_CONTRACT,
  environment.BLOCKCHAIN_RPC_ENDPOINT
);

/// Handlers
const connectionUrl = `postgres://${environment.POSTGRES_USER}:${environment.POSTGRES_PASSWORD}@${environment.POSTGRES_HOST}:${environment.POSTGRES_PORT}/${environment.POSTGRES_DB}`;
export const orbitSphereEventsHandler = new OrbitSphereEventsHandler(
  connectionUrl
);
