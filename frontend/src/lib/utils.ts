import { twMerge } from "tailwind-merge";
import { padHex, stringToHex } from "viem";
import { clsx, type ClassValue } from "clsx";
import { Instance } from "@/actions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const calculateRefundAmount = (instance: Instance): number => {
  const currentTime = new Date();
  const totalDuration =
    (instance.willBeEndOn.getTime() - instance.rentedOn.getTime()) / 3600000; // Total hours
  const elapsedTime =
    (currentTime.getTime() - instance.rentedOn.getTime()) / 3600000; // Hours used

  if (elapsedTime >= totalDuration) return 0; // No refund if fully used
  if (elapsedTime <= 0) return instance.totalCost; // Full refund if not started

  const usedCost = elapsedTime * instance.sphere.hourlyRate;
  const refundAmount = instance.totalCost - usedCost;

  return Math.max(Number(refundAmount.toFixed(2)), 0); // Ensure refund is not negative
};

export const isInstanceTerminated = (instance: Instance): boolean => {
  const currentTime = new Date();
  return (
    instance.status === "TERMINATED" || currentTime >= instance.willBeEndOn
  );
};

export const getTimeRemaining = (willBeEndOn: Date): string => {
  const currentTime = new Date();
  const timeRemaining = willBeEndOn.getTime() - currentTime.getTime();

  if (timeRemaining <= 0) return "00:00:00"; // Already completed
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

export const getCompletionPercentage = (
  rentedOn: Date,
  willBeEndOn: Date
): number => {
  const currentTime = new Date();
  const totalDuration = willBeEndOn.getTime() - rentedOn.getTime();
  const elapsedTime = currentTime.getTime() - rentedOn.getTime();
  if (elapsedTime <= 0) return 0; // Not started
  if (elapsedTime >= totalDuration) return 100; // Already completed
  return Math.floor((elapsedTime / totalDuration) * 100);
};

export const getDegree = (actualValue: number, totalValue: number) => {
  return (actualValue / totalValue) * 360;
};

export const minifyAddress = (address?: string) =>
  address?.replace(address.substring(10, 32), "...");

export const toBytes32 = (value: string) =>
  padHex(stringToHex(value, { size: 32 }), { dir: "right" });

export const capitalize = (text?: string) =>
  (text ?? "").toLowerCase().charAt(0).toUpperCase() +
  (text ?? "").toLowerCase().slice(1);
