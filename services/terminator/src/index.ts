/** @notice Library imports */
/// local imports
import {
  logger,
  orbitsphereAWS,
  orbitSphereDatabase,
  orbitSphereTerminationQueue,
} from "@/configs/clients";

await orbitSphereTerminationQueue.consume(async (payload) => {
  logger.info("Processing termination payload", payload);
  /// Terminating AWS instance
  const response = await orbitsphereAWS.terminate(payload);
  logger.info("Instance terminated", {
    instanceId: payload.instanceId,
  });
  // const { PublicIpAddress, PrivateIpAddress, InstanceId } = instance;
  /// Saving instance details into database
  await orbitSphereDatabase.instances.terminate(payload.instanceId);
  logger.info("Successfully processed termination request", {
    instanceId: payload.instanceId,
  });
});

logger.info("Started consuming OrbitSphere Termination queue");
