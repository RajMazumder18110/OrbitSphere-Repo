/** @notice Library imports */
import type { LaunchInstanceParams } from "@orbitsphere/aws";
import { fromBytes, fromBytes32 } from "@orbitsphere/blockchain";
import type {
  CreateInstanceParams,
  CreateRentalLogParams,
} from "@orbitSphere/database/schemas";
/// Local imports
import {
  logger,
  orbitsphere,
  orbitsphereAWS,
  orbitSphereDatabase,
  terminationScheduler,
} from "../configs/clients";
import { environment } from "../configs/environments";

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

      /// Recoding `OrbitSphereInstanceRented` into database
      const { blockNumber, transactionHash, data, topics } = payload.log;
      await orbitSphereDatabase.indexer.indexRentalEvent({
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

      /// Creating AWS instance
      logger.info("Creating SphereId", { sphereId });
      const instance = await orbitsphereAWS.launch({
        region,
        sshPublicKey,
        instanceType,
      } satisfies LaunchInstanceParams);
      const { PublicIpAddress, PrivateIpAddress, InstanceId } = instance;
      logger.info("Instance created", {
        sphereId,
        instanceId: InstanceId,
      });

      /// Saving instance details into database
      await orbitSphereDatabase.instances.create({
        region,
        tenant,
        sphereId,
        totalCost,
        sphere: instanceType,
        instanceId: InstanceId!,
        publicIp: PublicIpAddress!,
        privateIp: PrivateIpAddress!,
        rentedOn: new Date(Number(rentedOn.toString()) * 1_000),
        willBeEndOn: new Date(Number(willBeEndOn.toString()) * 1_000),
      } satisfies CreateInstanceParams);

      logger.info("Processing termination schedule payload", { sphereId });
      /// Adding into scheduler
      await terminationScheduler.schedule({
        sphereId: sphereId.toString(),
        terminateOn: new Date(Number(willBeEndOn.toString()) * 1_000),
        handler: async (sphereId) => {
          try {
            /// Force terminate instance
            const hash = await orbitsphere.forceTerminateSphere(
              sphereId,
              environment.ORBIT_SPHERE_TERMINATOR_PRIV_KEY
            );
            logger.info("Successfully force terminated", {
              hash,
              sphereId,
            });
          } catch (error) {
            logger.error("Not able to terminate", {
              sphereId,
            });
          }
        },
      });

      logger.info("Successfully scheduled termination request", {
        sphereId,
      });

      logger.info("Processed rental request", {
        sphereId,
      });
    } catch (error) {
      console.log(error);
    }
  }
);
