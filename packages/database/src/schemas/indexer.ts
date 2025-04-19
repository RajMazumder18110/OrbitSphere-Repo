/** @notice library imports */
import { pgTable, text, uuid } from "drizzle-orm/pg-core";
import { OrbitSphereEvents } from "@orbitsphere/blockchain";
/// Local imports
import { timestamps, blockchainFields } from "./common";

export const indexerTable = pgTable("Indexer", {
  id: uuid().notNull().defaultRandom().primaryKey(),
  /// Core fields
  blockNumber: blockchainFields.blockNumber,
  event: text({
    enum: [
      OrbitSphereEvents.INSTANCE_RENTED,
      OrbitSphereEvents.INSTANCE_TERMINATED,
    ],
  }).notNull(),
  /// Timestamps
  ...timestamps,
});

export type Indexer = typeof indexerTable.$inferSelect;
export type CreateIndex = Pick<Indexer, "blockNumber" | "event">;
