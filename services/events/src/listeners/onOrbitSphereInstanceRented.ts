/** @notice Library imports */
import { toUtf8String } from "@orbitsphere/orbiter";
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
      /// Adding into Rental queue
      await orbitsphereRentalQueue.publish({
        region: toUtf8String(region),
        instanceType: toUtf8String(instanceType),
        sshPublicKey: toUtf8String(sshPublicKey),
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
