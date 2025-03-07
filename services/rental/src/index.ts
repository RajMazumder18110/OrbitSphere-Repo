/** @notice Local imports */
import { orbitsphere } from "@/configs/constants";

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
    console.log({
      region,
      sphereId,
      instanceType,
      sshPublicKey,
      rentedOn,
      willBeEndOn,
      tenant,
      totalCost,
      //   payload,
    });
  }
);

await orbitsphere.onOrbitSphereInstanceTerminated(
  async (tenant, sphereId, actualCost, timeConsumed, refundAmount, payload) => {
    console.log({
      tenant,
      sphereId,
      actualCost,
      timeConsumed,
      refundAmount,
      // payload,
    });
  }
);

console.log("Listening...");
