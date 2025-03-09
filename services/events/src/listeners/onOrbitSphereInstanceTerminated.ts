/** @notice Library imports */
import type { CreateTerminationLogParams } from "@orbitsphere/database/schemas";
/// Local imports
import {
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
      await orbitSphereTerminationQueue.publish({
        region: instance?.region!,
        instanceId: instance?.instanceId!,
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

      console.log(`Terminating sphere id ${sphereId.toString()}...`);
    } catch (error) {
      console.error(error);
    }
  }
);
