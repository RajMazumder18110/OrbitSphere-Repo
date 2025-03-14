/** @notice Library imports */
/// local imports
import {
  logger,
  orbitsphereContract,
  rentalConsumer,
  terminationScheduler,
} from "@/configs/clients";

await rentalConsumer.consume(async (payload) => {
  logger.info("Processing termination schedule payload", payload);
  /// Adding into scheduler
  await terminationScheduler.schedule({
    sphereId: payload.sphereId,
    terminateOn: new Date(Number(payload.willBeEndOn) * 1_000),
    handler: async (sphereId) => {
      try {
        /// Force terminate instance
        await orbitsphereContract.forceTerminate(sphereId);
        logger.info("Successfully force terminated", {
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

logger.info("Started termination scheduling");
