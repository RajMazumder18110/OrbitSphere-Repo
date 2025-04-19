/** @notice Library imports */
import scheduler from "node-schedule";
import { OrbitSphereEvents } from "../services/OrbitSphere";
/// Local imports
import { environment } from "../configs/environments";
import { logger, orbitsphere, orbitSphereDatabase } from "../configs/clients";

/// Index time
const INDEX_SCHEDULER_ON = "*/5 * * * *"; // Every 5 minutes (on every 100 block)

scheduler.scheduleJob(INDEX_SCHEDULER_ON, async () => {
  try {
    /// Grabbing last indexed block
    const rentalIndex =
      await orbitSphereDatabase.indexer.getIndexedRentalEvent();

    /// Grabbing from block
    const fromBlock = (() => {
      const source = rentalIndex
        ? Number(rentalIndex.blockNumber)
        : Number(environment.ORBIT_SPHERE_CONTRACT_DEPLOYED_ON_BLOCK);
      return source + 1;
    })();

    /// Grabbing latest block
    const latestBlock = await orbitsphere.getLastBlockNumber();

    const allEvents = await orbitsphere.filterOrbitSphereInstanceRented({
      fromBlock,
    });
    /// if have some events
    if (Boolean(allEvents.length)) {
      /// Adding into Rental queue
      const queuePayload = allEvents.map((e) => ({
        region: e.region,
        tenant: e.tenant,
        sshPublicKey: e.sshPublicKey,
        instanceType: e.instanceType,
        sphereId: e.sphereId.toString(),
        rentedOn: e.rentedOn.toString(),
        totalCost: e.totalCost.toString(),
        willBeEndOn: e.willBeEndOn.toString(),
      }));

      /// Adding to database
      await orbitSphereDatabase.indexer.indexRentalEvents(allEvents);
      logger.info(
        "[SCHEDULER] Successfully recorded rental request into database",
        {
          length: allEvents.length,
        }
      );
    }
    /// Update the latest block
    await orbitSphereDatabase.indexer.indexBlockNumber({
      blockNumber: BigInt(latestBlock),
      event: OrbitSphereEvents.INSTANCE_RENTED,
    });

    logger.info("Successfully schedule check");
  } catch (error) {
    logger.error("Schedule check failed", { error });
  }
});

scheduler.scheduleJob(INDEX_SCHEDULER_ON, async () => {
  try {
    /// Grabbing last indexed block
    const terminationIndex =
      await orbitSphereDatabase.indexer.getIndexedTerminationEvent();

    /// Grabbing from block
    const fromBlock = (() => {
      const source = terminationIndex
        ? Number(terminationIndex.blockNumber)
        : Number(environment.ORBIT_SPHERE_CONTRACT_DEPLOYED_ON_BLOCK);
      return source + 1;
    })();

    /// Grabbing latest block
    const latestBlock = await orbitsphere.getLastBlockNumber();

    const allEvents = await orbitsphere.filterOrbitSphereInstanceTerminated({
      fromBlock,
    });
    /// if have some events
    if (Boolean(allEvents.length)) {
      /// Adding into Rental queue
      const queuePayload = allEvents.map(async (e) => {
        const instance =
          await orbitSphereDatabase.instances.getInstanceBySphereId(e.sphereId);
        return {
          sphereId: e.sphereId.toString(),
          region: instance?.region!.value!,
          instanceId: instance?.instanceId!,
          actualCost: e.actualCost.toString(),
          timeConsumed: e.timeConsumed.toString(),
          refundAmount: e.refundAmount.toString(),
        };
      });

      const allPayload = await Promise.all(queuePayload);

      /// Adding to database
      await orbitSphereDatabase.indexer.indexTerminationEvents(allEvents);
      logger.info(
        "[SCHEDULER] Successfully recorded termination request into database",
        {
          length: allEvents.length,
        }
      );
    }
    /// Update the latest block
    await orbitSphereDatabase.indexer.indexBlockNumber({
      blockNumber: BigInt(latestBlock),
      event: OrbitSphereEvents.INSTANCE_TERMINATED,
    });

    logger.info("Successfully schedule check");
  } catch (error) {
    logger.error("Schedule check failed", { error });
  }
});
