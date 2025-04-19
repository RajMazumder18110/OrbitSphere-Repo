/** @notice library imports */
import { bigint, pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
/// Local imports
import { blockchainFields, timestamps } from "./common";
import { tenantsTable } from "./tenants";

export const rentalLogsTable = pgTable("RentalLogs", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  region: text().notNull(),
  instanceType: text().notNull(),
  sshPublicKey: text().notNull(),
  tenant: varchar({ length: 42 })
    .notNull()
    .references(() => tenantsTable.address),
  rentedOn: bigint({ mode: "bigint" }).notNull(),
  totalCost: bigint({ mode: "bigint" }).notNull(),
  willBeEndOn: bigint({ mode: "bigint" }).notNull(),
  sphereId: bigint({ mode: "bigint" })
    .notNull()
    .unique("uniqueRentalLogSphereId"),

  /// Blockchain data
  ...blockchainFields,

  /// Timestamps
  ...timestamps,
});

export type RentalLog = typeof rentalLogsTable.$inferSelect;
export type CreateRentalLogParams = Omit<
  RentalLog,
  "createdAt" | "updatedAt" | "id"
>;
