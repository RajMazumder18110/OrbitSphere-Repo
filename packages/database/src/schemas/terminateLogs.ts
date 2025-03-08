/** @notice library imports */
import { bigint, pgTable, varchar, uuid } from "drizzle-orm/pg-core";
/// Local imports
import { tenantsTable } from "./tenants";
import { rentalLogsTable } from "./rentalLogs";
import { blockchainFields, timestamps } from "./common";

export const terminateLogsTable = pgTable("TerminationLogs", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  sphereId: bigint({ mode: "bigint" })
    .notNull()
    .unique("uniqueTerminationLogSphereId")
    .references(() => rentalLogsTable.sphereId),
  tenant: varchar({ length: 42 })
    .notNull()
    .references(() => tenantsTable.address),
  actualCost: bigint({ mode: "bigint" }).notNull(),
  timeConsumed: bigint({ mode: "bigint" }).notNull(),
  refundAmount: bigint({ mode: "bigint" }).notNull(),

  /// Blockchain data
  ...blockchainFields,

  /// Timestamps
  ...timestamps,
});

export type TerminationLog = typeof terminateLogsTable.$inferSelect;
export type CreateTerminationLogParams = Omit<
  TerminationLog,
  "createdAt" | "updatedAt" | "id"
>;
