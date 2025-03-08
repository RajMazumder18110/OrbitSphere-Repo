/** @notice library imports */
import { relations } from "drizzle-orm";
import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
/// Local imports
import { timestamps } from "./common";
import { rentalLogsTable } from "./rentalLogs";
import { terminateLogsTable } from "./terminateLogs";

export const tenantsTable = pgTable("Tenants", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  address: varchar({ length: 42 }).notNull().unique("tenantAddressUnique"),
  /// Timestamps
  ...timestamps,
});

/// Relations
export const tenantRelations = relations(tenantsTable, ({ many }) => ({
  rentalLogs: many(rentalLogsTable),
  terminationLogs: many(terminateLogsTable),
}));

export type Tenant = typeof tenantsTable.$inferSelect;
export type CreateTenantParams = Omit<Tenant, "createdAt" | "updatedAt" | "id">;
