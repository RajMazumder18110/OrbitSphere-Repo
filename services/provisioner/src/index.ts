/** @notice Local imports */
import { orbitsphereRentalQueue, orbitsphereAWS } from "@/configs/clients";

await orbitsphereRentalQueue.consume(async (payload) => {
  /// Creating AWS instance
  const instance = await orbitsphereAWS.launch(payload);
  console.log({
    aws: instance.PublicIpAddress,
  });
});

console.log("Consuming...");
