/** @notice Library imports */
import type { CreateRentalLogParams } from "@orbitsphere/database/schemas";
/// Local imports
import { orbitsphere, orbitSphereEventsHandler } from "@/configs/clients";

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

      /// Recoding `OrbitSphereInstanceRented` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereEventsHandler.recordRentalLog({
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

      console.log(`Processing sphere id ${sphereId.toString()}`);
    } catch (error) {
      console.log(error);
    }
  }
);

console.log("Listening...");
