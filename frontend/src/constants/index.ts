import { Hex } from "viem";
/// Environements ///

/// Blockchain
export const USDC = process.env.USDC as Hex;
export const ORBITSPHERE = process.env.ORBIT_SPHERE_CONTRACT as Hex;

/// Appliaction constants
export const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL;
export const MINIMUM_TIME_TO_RENT =
  Number(process.env.MINIMUM_TIME_TO_RENT) ?? 10;
export const DEFAULT_PAGE_LIMIT = Number(process.env.DEFAULT_PAGE_LIMIT) ?? 8;

/// AWS
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
