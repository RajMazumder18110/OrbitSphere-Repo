/** @notice Library imports */
import { z } from "zod";
import { toHex } from "viem";
/// Local imports
import { toBytes32 } from "./lib/utils";
import { MINIMUM_TIME_TO_RENT } from "./constants";

export const launchInstanceSchema = z.object({
  region: z
    .enum(["ap-south-1", "us-west-1"], {
      required_error: "Please select region",
    })
    .transform((val) => toBytes32(val)),

  instance: z
    .enum(["t2.micro", "t2.small", "t2.medium", "t2.large", "t2.xlarge"], {
      required_error: "Please select sphere",
    })
    .transform((val) => toBytes32(val)),

  sshPubKey: z
    .string({
      required_error: "Please generate ssh key",
    })
    .transform((val) => toHex(val)),

  terminateOn: z
    .date({
      required_error: "Please select termination time",
    })
    .refine(
      (date) => date.getTime() > Date.now() + MINIMUM_TIME_TO_RENT * 60 * 1000,
      {
        message: `Termination time must be at least ${MINIMUM_TIME_TO_RENT} minutes from now`,
      }
    )
    .transform((date) =>
      BigInt(Math.floor((date.getTime() - Date.now()) / 1000))
    ),
});

export type LaunchInstanceSchema = z.infer<typeof launchInstanceSchema>;
