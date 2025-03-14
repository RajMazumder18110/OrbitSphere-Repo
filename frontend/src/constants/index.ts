import { Hex } from "viem";
/// Environements ///

/// Client variables
export const USDC = process.env.NEXT_PUBLIC_USDC as Hex;
export const ORBITSPHERE = process.env.NEXT_PUBLIC_ORBIT_SPHERE_CONTRACT as Hex;
export const MINIMUM_TIME_TO_RENT =
  Number(process.env.NEXT_PUBLIC_MINIMUM_TIME_TO_RENT) ?? 10;
export const DEFAULT_PAGE_LIMIT =
  Number(process.env.NEXT_PUBLIC_DEFAULT_PAGE_LIMIT) ?? 8;

/// Server variables
export const DATABASE_CONNECTION_URL = process.env.DATABASE_CONNECTION_URL;
export const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
