/** @notice Local imports */
import { logger } from "./configs/clients";
// import "./indexer/scheduler";
import "./listeners/onOrbitSphereInstanceRented";
import "./listeners/onOrbitSphereInstanceTerminated";

logger.info("Started listening OrbitSphere contract events");
