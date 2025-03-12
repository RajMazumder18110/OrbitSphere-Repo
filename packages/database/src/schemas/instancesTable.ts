/** @notice library imports */
import { relations } from "drizzle-orm";
import {
  bigint,
  pgTable,
  text,
  varchar,
  uuid,
  timestamp,
} from "drizzle-orm/pg-core";
/// Local imports
import { timestamps } from "./common";
import { tenantsTable, regionsTable, spheresTable } from "./index";

export const enum InstanceStatus {
  QUEUED = "QUEUED",
  RUNNING = "RUNNING",
  TERMINATED = "TERMINATED",
}

export const instancesTable = pgTable("Instances", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  region: varchar({ length: 20 })
    .notNull()
    .references(() => regionsTable.value),
  sphere: varchar({ length: 50 })
    .notNull()
    .references(() => spheresTable.name),
  tenant: varchar({ length: 42 })
    .notNull()
    .references(() => tenantsTable.address),
  instanceId: varchar({ length: 255 })
    .notNull()
    .unique("uniqueInstanceInstanceId"),
  sphereId: bigint({ mode: "bigint" })
    .notNull()
    .unique("uniqueInstanceSphereId"),
  publicIp: text().notNull(),
  privateIp: text().notNull(),
  status: text({
    enum: [
      InstanceStatus.QUEUED,
      InstanceStatus.RUNNING,
      InstanceStatus.TERMINATED,
    ],
  })
    .notNull()
    .default(InstanceStatus.RUNNING),
  willBeEndOn: timestamp().notNull(),
  rentedOn: timestamp().notNull().defaultNow(),
  totalCost: bigint({ mode: "bigint" }).notNull(),

  /// Upon termination
  terminatedOn: timestamp(),
  actualCost: bigint({ mode: "bigint" }),
  timeConsumed: bigint({ mode: "bigint" }),
  refundAmount: bigint({ mode: "bigint" }),

  /// Timestamps
  ...timestamps,
});

/// Relations
export const instanceRelations = relations(instancesTable, ({ one }) => ({
  region: one(regionsTable, {
    fields: [instancesTable.region],
    references: [regionsTable.value],
  }),

  sphere: one(spheresTable, {
    fields: [instancesTable.sphere],
    references: [spheresTable.name],
  }),

  tenant: one(tenantsTable, {
    fields: [instancesTable.tenant],
    references: [tenantsTable.address],
  }),
}));

export type Instance = typeof instancesTable.$inferSelect;
export type UpdateInstanceStateParams = Pick<Instance, "status">;
export type CreateInstanceParams = Omit<
  typeof instancesTable.$inferInsert,
  "createdAt" | "updatedAt" | "id" | "status"
>;
