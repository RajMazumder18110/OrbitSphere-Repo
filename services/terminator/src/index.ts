/** @notice Library imports */
/// lOcal imports
import {
  orbitsphereAWS,
  orbitSphereDatabase,
  orbitSphereTerminationQueue,
} from "@/configs/clients";

await orbitSphereTerminationQueue.consume(async (payload) => {
  /// Creating AWS instance
  const instance = await orbitsphereAWS.terminate(payload);
  // const { PublicIpAddress, PrivateIpAddress, InstanceId } = instance;
  /// Saving instance details into database
  await orbitSphereDatabase.instances.terminate(payload.instanceId);
});

console.log("Consuming...");
