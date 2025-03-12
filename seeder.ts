/** @notice Library imports */
import { toUtf8String } from "ethers";
import { OrbitSphereDatabase } from "./packages/database/src/handlers/OrbitSphereBase";
import type {
  CreateRegionParams,
  CreateSphereParams,
} from "./packages/database/src/schemas";

const orbitSphereDatabase = new OrbitSphereDatabase(
  OrbitSphereDatabase.databaseUrl
);

const regions = [
  {
    name: "Asia (Mumbai)",
    value: "ap-south-1",
    isEnabled: true,
  },
  {
    name: "US (California)",
    value: "us-west-1",
    isEnabled: true,
  },
];

const spheres = [
  {
    name: "t2.micro",
    hourlyRate: 20000n, // 0.02 USDT
    noOfCPUs: 1n,
    noOfGPUs: 0n,
    memoryGiB: 1n,
    storageGiB: 8n,
    isEnabled: true,
  },
  {
    name: "t2.small",
    hourlyRate: 30000n, // 0.03 USDT
    noOfCPUs: 1n,
    noOfGPUs: 0n,
    memoryGiB: 2n,
    storageGiB: 8n,
    isEnabled: false,
  },
  {
    name: "t2.medium",
    hourlyRate: 50000n, // 0.05 USDT
    noOfCPUs: 2n,
    noOfGPUs: 0n,
    memoryGiB: 4n,
    storageGiB: 8n,
    isEnabled: false,
  },
  {
    name: "t2.large",
    hourlyRate: 120000n, // 0.12 USDT
    noOfCPUs: 2n,
    noOfGPUs: 0n,
    memoryGiB: 8n,
    storageGiB: 8n,
    isEnabled: false,
  },
  {
    name: "t2.xlarge",
    hourlyRate: 220000n, /// 0.22 USDT
    noOfCPUs: 4n,
    noOfGPUs: 0n,
    memoryGiB: 16n,
    storageGiB: 8n,
    isEnabled: false,
  },
];

// regions.forEach(async (region) => {
//   await orbitSphereDatabase.regions.create(region satisfies CreateRegionParams);
// });

// spheres.forEach(async (spheres) => {
//   await orbitSphereDatabase.spheres.create(
//     spheres satisfies CreateSphereParams
//   );
// });
