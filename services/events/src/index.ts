/** @notice Library imports */
import type {
  CreateRentalLogParams,
  CreateTerminationLogParams,
} from "@orbitsphere/database/schemas";
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

      console.log(`Processing sphere id ${sphereId.toString()}...`);
    } catch (error) {
      console.log(error);
    }
  }
);

await orbitsphere.onOrbitSphereInstanceTerminated(
  async (tenant, sphereId, actualCost, timeConsumed, refundAmount, payload) => {
    try {
      /// Adding into Termination queue

      /// Recoding `OrbitSphereInstanceTerminated` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereEventsHandler.recordTerminationLog({
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

console.log("Listening...");
