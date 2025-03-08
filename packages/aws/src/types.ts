/** @notice Library imports */
import type { Hex } from "viem";

/// Types
export type LaunchInstanceParams = {
  region: Hex;
  sshPublicKey: Hex;
  instanceType: Hex;
};
export type RunningInstanceParams = {
  region: Hex;
  instanceId: string;
};
