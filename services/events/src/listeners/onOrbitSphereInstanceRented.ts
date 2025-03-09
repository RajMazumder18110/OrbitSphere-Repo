/** @notice Library imports */
import { fromBytes32 } from "@orbitsphere/orbiter";
import type { CreateRentalLogParams } from "@orbitsphere/database/schemas";
/// Local imports
import {
  orbitsphere,
  orbitSphereDatabase,
  orbitsphereRentalQueue,
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
      sshPublicKey = fromBytes32(sshPublicKey);
      instanceType = fromBytes32(instanceType);

      /// Adding into Rental queue
      await orbitsphereRentalQueue.publish({
        region,
        tenant,
        sshPublicKey,
        instanceType,
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

      console.log(`Processing sphere id ${sphereId.toString()}...`);
    } catch (error) {
      console.log(error);
    }
  }
);
