import { twMerge } from "tailwind-merge";
import { padHex, stringToHex } from "viem";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const minifyAddress = (address?: string) =>
  address?.replace(address.substring(10, 32), "...");

export const toBytes32 = (value: string) =>
  padHex(stringToHex(value, { size: 32 }), { dir: "right" });

export const capitalize = (text?: string) =>
  (text ?? "").toLowerCase().charAt(0).toUpperCase() +
  (text ?? "").toLowerCase().slice(1);
