/** @notice Library imports */
import "dotenv/config";
import { OrbitSphere } from "@orbitsphere/orbiter";

export const ORBIT_SPHERE_CONTRACT =
  "0x972b861ebbf74583f2f27c42d11132b03eb8d493";
export const BLOCKCHAIN_RPC_ENDPOINT = process.env.BLOCKCHAIN_RPC_ENDPOINT!;

/// OrbitSphere
export const orbitsphere = new OrbitSphere(
  ORBIT_SPHERE_CONTRACT,
  BLOCKCHAIN_RPC_ENDPOINT
);
