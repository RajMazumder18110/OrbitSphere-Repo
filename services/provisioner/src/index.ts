/** @notice Library imports */
import type { CreateInstanceParams } from "@orbitsphere/database/schemas";
/// local imports
import {
  logger,
  orbitsphereAWS,
  orbitSphereDatabase,
  orbitsphereRentalQueue,
} from "@/configs/clients";

await orbitsphereRentalQueue.consume(async (payload) => {
  logger.info("Processing rental payload", payload);
  /// Creating AWS instance
  const instance = await orbitsphereAWS.launch(payload);
  const { PublicIpAddress, PrivateIpAddress, InstanceId } = instance;
  logger.info("Instance created", {
    sphereId: payload.sphereId,
    instanceId: InstanceId,
  });

  /// Saving instance details into database
  await orbitSphereDatabase.instances.create({
    region: payload.region,
    instanceId: InstanceId!,
    tenant: payload.tenant,
    publicIp: PublicIpAddress!,
    privateIp: PrivateIpAddress!,
    sphere: payload.instanceType,
    sphereId: BigInt(payload.sphereId),
    totalCost: BigInt(payload.totalCost),
    rentedOn: new Date(Number(payload.rentedOn) * 1_000),
    willBeEndOn: new Date(Number(payload.willBeEndOn) * 1_000),
  } satisfies CreateInstanceParams);

  logger.info("Processed rental request", {
    sphereId: payload.sphereId,
  });
});

logger.info("Started consuming OrbitSphere Rental queue");
