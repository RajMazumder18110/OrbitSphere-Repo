/** @notice Library imports */
import type { TerminateInstanceParams } from "@orbitsphere/database/schemas";
/// local imports
import {
  logger,
  orbitsphereAWS,
  orbitSphereDatabase,
  orbitSphereTerminationConsumer,
} from "@/configs/clients";

await orbitSphereTerminationConsumer.consume(async (payload) => {
  logger.info("Processing termination payload", payload);
  /// Terminating AWS instance
  const response = await orbitsphereAWS.terminate(payload);
  logger.info("Instance terminated", {
    instanceId: payload.instanceId,
  });

  /// Saving instance details into database
  await orbitSphereDatabase.instances.terminate({
    terminatedOn: new Date(),
    instanceId: payload.instanceId,
    actualCost: BigInt(payload.actualCost),
    timeConsumed: BigInt(payload.timeConsumed),
    refundAmount: BigInt(payload.refundAmount),
  } satisfies TerminateInstanceParams);

  logger.info("Successfully processed termination request", {
    instanceId: payload.instanceId,
  });
});

logger.info("Started consuming OrbitSphere Termination queue");
