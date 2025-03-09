/** @notice Library imports */
import type { CreateInstanceParams } from "@orbitsphere/database/schemas";
/// lOcal imports
import {
  orbitsphereAWS,
  orbitSphereDatabase,
  orbitsphereRentalQueue,
} from "@/configs/clients";

await orbitsphereRentalQueue.consume(async (payload) => {
  /// Creating AWS instance
  const instance = await orbitsphereAWS.launch(payload);
  const { PublicIpAddress, PrivateIpAddress, InstanceId } = instance;
  /// Saving instance details into database
  await orbitSphereDatabase.instances.create({
    region: payload.region,
    instanceId: InstanceId!,
    instanceType: payload.instanceType,
    sphereId: BigInt(payload.sphereId),
    publicIp: PublicIpAddress!,
    privateIp: PrivateIpAddress!,
    tenant: payload.tenant,
  } satisfies CreateInstanceParams);
});

console.log("Consuming...");
