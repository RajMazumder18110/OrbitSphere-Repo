/** @notice Library imports */
import type { CreateTerminationLogParams } from "@orbitsphere/database/schemas";
/// Local imports
import {
  logger,
  orbitsphere,
  orbitSphereDatabase,
  orbitSphereTerminationQueue,
} from "@/configs/clients";

await orbitsphere.onOrbitSphereInstanceTerminated(
  async (tenant, sphereId, actualCost, timeConsumed, refundAmount, payload) => {
    try {
      /// Adding into Termination queue
      const instance =
        await orbitSphereDatabase.instances.getInstanceBySphereId(sphereId);

      logger.info("Requested for termination", {
        tenant,
        sphereId: sphereId.toString(),
        instanceId: instance?.instanceId,
      });

      await orbitSphereTerminationQueue.publish({
        region: instance?.region!,
        instanceId: instance?.instanceId!,
      });

      logger.info("Queued termination request", {
        sphereId: sphereId.toString(),
      });

      /// Recoding `OrbitSphereInstanceTerminated` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereDatabase.events.recordTerminationLog({
        /// Core
        tenant,
        sphereId,
        actualCost,
        timeConsumed,
        refundAmount,
        /// Blockchain
        data,
        topics,
        transactionHash,
        blockNumber: BigInt(blockNumber),
      } satisfies CreateTerminationLogParams);

      logger.info(`Terminating sphereId ${sphereId.toString()}`, {
        tenant,
        sphereId: sphereId.toString(),
        instanceId: instance?.instanceId,
      });
    } catch (error) {
      console.error(error);
    }
  }
);
