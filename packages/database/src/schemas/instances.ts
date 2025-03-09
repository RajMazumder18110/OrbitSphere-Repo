/** @notice library imports */
import { bigint, pgTable, text, varchar, uuid } from "drizzle-orm/pg-core";
/// Local imports
import { timestamps } from "./common";
import { tenantsTable } from "./tenants";

export const enum InstanceStatus {
  RUNNING = "RUNNING",
  TERMINATED = "TERMINATED",
}

export const instancesTable = pgTable("Instances", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  region: text().notNull(),
  instanceType: text().notNull(),
  tenant: varchar({ length: 42 })
    .notNull()
    .references(() => tenantsTable.address),
  instanceId: varchar({ length: 255 })
    .notNull()
    .unique("uniqueInstanceInstanceIdId"),
  sphereId: bigint({ mode: "bigint" })
    .notNull()
    .unique("uniqueInstanceSphereId"),
  publicIp: text().notNull(),
  privateIp: text().notNull(),
  status: text({
    enum: [InstanceStatus.RUNNING, InstanceStatus.TERMINATED],
  })
    .notNull()
    .default(InstanceStatus.RUNNING),

  /// Timestamps
  ...timestamps,
});

export type Instance = typeof instancesTable.$inferSelect;
export type UpdateInstanceStateParams = Pick<Instance, "status">;
export type CreateInstanceParams = Omit<
  Instance,
  "createdAt" | "updatedAt" | "id" | "status"
>;
