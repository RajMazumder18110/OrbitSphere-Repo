/** @notice library imports */
import { desc, eq } from "drizzle-orm";
import { OrbitSphereEvents } from "@orbitsphere/blockchain";
/// Local imports
import {
  tenantsTable,
  rentalLogsTable,
  terminateLogsTable,
  indexerTable,
  type CreateRentalLogParams,
  type CreateTerminationLogParams,
  type CreateIndex,
} from "../schemas";
import type { DBType } from "./OrbitSphereBase";

export class OrbitSphereEventsIndexer {
  constructor(private connection: DBType) {}

  /// Indexing single rental event.
  public indexRentalEvent(data: CreateRentalLogParams) {
    return this.connection.transaction(async (tx) => {
      /// Create tenant first if doesn't present
      await tx
        .insert(tenantsTable)
        .values({ address: data.tenant.toLowerCase() })
        .onConflictDoNothing();
      /// Create OrbitSphereInstanceRented log
      await tx.insert(rentalLogsTable).values({
        ...data,
        tenant: data.tenant.toLowerCase(),
      });

      /// Adding index record into Indexer
      await tx.insert(indexerTable).values({
        blockNumber: data.blockNumber,
        event: OrbitSphereEvents.INSTANCE_RENTED,
      });
    });
  }

  /// Indexing multiple rental event.
  public indexRentalEvents(data: CreateRentalLogParams[]) {
    return this.connection.transaction(async (tx) => {
      /// Create tenant first if doesn't present
      const allTenants = data.map((t) => ({ address: t.tenant.toLowerCase() }));
      await tx.insert(tenantsTable).values(allTenants).onConflictDoNothing();

      /// Create OrbitSphereInstanceRented log
      const allRecords = data.map((d) => ({
        ...d,
        tenant: d.tenant.toLowerCase(),
      }));
      await tx.insert(rentalLogsTable).values(allRecords);

      /// Adding last entry blockNumber record into Indexer
      await tx.insert(indexerTable).values({
        blockNumber: data.at(-1)!.blockNumber,
        event: OrbitSphereEvents.INSTANCE_RENTED,
      });
    });
  }

  /// Indexing single termination event.
  public indexTerminationEvent(data: CreateTerminationLogParams) {
    return this.connection.transaction(async (tx) => {
      /// Adding termination record
      await tx.insert(terminateLogsTable).values({
        ...data,
        tenant: data.tenant.toLowerCase(),
      });

      /// Adding index record into Indexer
      await tx.insert(indexerTable).values({
        blockNumber: data.blockNumber,
        event: OrbitSphereEvents.INSTANCE_TERMINATED,
      });
    });
  }

  /// Indexing single termination event.
  public indexTerminationEvents(data: CreateTerminationLogParams[]) {
    return this.connection.transaction(async (tx) => {
      /// Adding termination record
      const allRecords = data.map((d) => ({
        ...d,
        tenant: d.tenant.toLowerCase(),
      }));
      await tx.insert(terminateLogsTable).values(allRecords);

      /// Adding index record into Indexer
      await tx.insert(indexerTable).values({
        blockNumber: data.at(-1)!.blockNumber,
        event: OrbitSphereEvents.INSTANCE_TERMINATED,
      });
    });
  }

  /// Index blockNumber
  public indexBlockNumber(payload: CreateIndex) {
    return this.connection.insert(indexerTable).values(payload);
  }
  /// Returns the last indexed block for rental event.
  public getIndexedRentalEvent() {
    return this.connection.query.indexerTable.findFirst({
      orderBy: desc(indexerTable.blockNumber),
      where: eq(indexerTable.event, OrbitSphereEvents.INSTANCE_RENTED),
      columns: {
        blockNumber: true,
      },
    });
  }

  /// Returns the last indexed block for termination event.
  public getIndexedTerminationEvent() {
    return this.connection.query.indexerTable.findFirst({
      orderBy: desc(indexerTable.blockNumber),
      where: eq(indexerTable.event, OrbitSphereEvents.INSTANCE_TERMINATED),
      columns: {
        blockNumber: true,
      },
    });
  }
}
