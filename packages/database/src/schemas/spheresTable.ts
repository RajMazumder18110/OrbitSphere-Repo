/** @notice library imports */
import { pgTable, varchar, uuid, boolean, bigint } from "drizzle-orm/pg-core";
/// Local imports
import { timestamps } from "./common";

export const spheresTable = pgTable("Spheres", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  isEnabled: boolean().notNull().default(true),
  hourlyRate: bigint({ mode: "bigint" }).notNull(),
  noOfCPUs: bigint({ mode: "bigint" }).notNull(),
  noOfGPUs: bigint({ mode: "bigint" }).notNull(),
  memoryGiB: bigint({ mode: "bigint" }).notNull(),
  storageGiB: bigint({ mode: "bigint" }).notNull(),
  name: varchar({ length: 50 }).notNull().unique("sphere_name"),

  /// Timestamps
  ...timestamps,
});

export type Sphere = typeof spheresTable.$inferSelect;
export type CreateSphereParams = Omit<Sphere, "createdAt" | "updatedAt" | "id">;
