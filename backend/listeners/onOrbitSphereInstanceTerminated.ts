/** @notice Library imports */
import type {
  CreateTerminationLogParams,
  TerminateInstanceParams,
} from "@orbitSphere/database/schemas";
import type { RunningInstanceParams } from "@orbitsphere/aws";
/// Local imports
import {
  logger,
  orbitsphere,
  orbitsphereAWS,
  orbitSphereDatabase,
  terminationScheduler,
} from "../configs/clients";

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

      /// Recoding `OrbitSphereInstanceTerminated` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereDatabase.indexer.indexTerminationEvent({
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

      /// Saving instance details into database
      await orbitSphereDatabase.instances.terminate({
        actualCost,
        timeConsumed,
        refundAmount,
        terminatedOn: new Date(),
        instanceId: instance!.instanceId,
      } satisfies TerminateInstanceParams);

      logger.info(`Terminating sphereId ${sphereId.toString()}`, {
        tenant,
        sphereId: sphereId.toString(),
        instanceId: instance?.instanceId,
      });

      /// Terminating AWS instance
      const response = await orbitsphereAWS.terminate({
        region: instance?.region.value!,
        instanceId: instance?.instanceId!,
      } satisfies RunningInstanceParams);
      logger.info("Instance terminated", {
        instanceId: instance?.instanceId,
      });

      logger.info("Processing termination cancel schedule payload", {
        sphereId,
      });
      /// Adding into scheduler
      await terminationScheduler.cancel(sphereId.toString());

      logger.info("Successfully canceled termination schedule request", {
        sphereId,
      });

      logger.info("Successfully processed termination request", {
        instanceId: instance!.instanceId,
      });
    } catch (error) {
      console.error(error);
    }
  }
);
