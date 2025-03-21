/** @notice Library imports */
/// local imports
import {
  logger,
  orbitsphereContract,
  rentalConsumer,
  terminationConsumer,
  terminationScheduler,
} from "@/configs/clients";
import { environment } from "@/configs/environments";

await rentalConsumer.consume(async (payload) => {
  logger.info("Processing termination schedule payload", payload);
  /// Adding into scheduler
  await terminationScheduler.schedule({
    sphereId: payload.sphereId,
    terminateOn: new Date(Number(payload.willBeEndOn) * 1_000),
    handler: async (sphereId) => {
      try {
        /// Force terminate instance
        const hash = await orbitsphereContract.forceTerminateSphere(
          sphereId,
          environment.ORBIT_SPHERE_TERMINATOR_PRIV_KEY
        );
        logger.info("Successfully force terminated", {
          hash,
          sphereId: payload.sphereId,
        });
      } catch (error) {
        logger.error("Not able to terminate", {
          sphereId: payload.sphereId,
        });
      }
    },
  });

  logger.info("Successfully scheduled termination request", {
    sphereId: payload.sphereId,
  });
});

await terminationConsumer.consume(async (payload) => {
  logger.info("Processing termination cancel schedule payload", payload);
  /// Adding into scheduler
  await terminationScheduler.cancel(payload.sphereId);

  logger.info("Successfully canceled termination schedule request", {
    sphereId: payload.sphereId,
  });
});

logger.info("Started termination scheduling");
