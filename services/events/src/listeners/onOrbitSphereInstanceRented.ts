/** @notice Library imports */
import { fromBytes, fromBytes32 } from "@orbitsphere/orbiter";
import type { CreateRentalLogParams } from "@orbitsphere/database/schemas";
/// Local imports
import {
  logger,
  orbitsphere,
  orbitSphereDatabase,
  orbitsphereRentalEventProducer,
} from "@/configs/clients";

await orbitsphere.onOrbitSphereInstanceRented(
  async (
    region,
    sphereId,
    instanceType,
    sshPublicKey,
    rentedOn,
    willBeEndOn,
    tenant,
    totalCost,
    payload
  ) => {
    try {
      /// Converting into utf8
      region = fromBytes32(region);
      sshPublicKey = fromBytes(sshPublicKey);
      instanceType = fromBytes32(instanceType);

      logger.info("Requested for instance", {
        tenant,
        region,
        instanceType,
        sphereId: sphereId.toString(),
      });

      /// Adding into Rental queue
      await orbitsphereRentalEventProducer.publish({
        region,
        tenant,
        sshPublicKey,
        instanceType,
        sphereId: sphereId.toString(),
        rentedOn: rentedOn.toString(),
        totalCost: totalCost.toString(),
        willBeEndOn: willBeEndOn.toString(),
      });

      logger.info("Queued rental request", {
        sphereId: sphereId.toString(),
      });

      /// Recoding `OrbitSphereInstanceRented` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereDatabase.events.recordRentalLog({
        /// Core
        region,
        sphereId,
        instanceType,
        sshPublicKey,
        rentedOn,
        willBeEndOn,
        tenant,
        totalCost,
        /// Blockchain
        data,
        topics,
        transactionHash,
        blockNumber: BigInt(blockNumber),
      } satisfies CreateRentalLogParams);

      logger.info(`Initializing sphereId ${sphereId.toString()}`, {
        tenant,
        region,
        instanceType,
        sphereId: sphereId.toString(),
      });
    } catch (error) {
      console.log(error);
    }
  }
);
