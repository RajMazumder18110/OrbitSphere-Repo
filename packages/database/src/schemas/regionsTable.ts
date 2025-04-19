/** @notice library imports */
import { pgTable, varchar, uuid, boolean } from "drizzle-orm/pg-core";
/// Local imports
import { timestamps } from "./common";

export const regionsTable = pgTable("Regions", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  isEnabled: boolean().notNull().default(true),
  name: varchar({ length: 255 }).notNull(),
  value: varchar({ length: 20 }).notNull().unique("region_type"),
  /// Timestamps
  ...timestamps,
});

export type Region = typeof regionsTable.$inferSelect;
export type CreateRegionParams = Omit<Region, "createdAt" | "updatedAt" | "id">;
