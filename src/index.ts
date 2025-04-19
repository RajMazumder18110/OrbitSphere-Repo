/** @notice Local imports */
import { logger } from "./configs/clients";
// import "./indexer/scheduler";
import "./indexer/onOrbitSphereInstanceRented";
import "./indexer/onOrbitSphereInstanceTerminated";

logger.info("Started listening OrbitSphere contract events");
