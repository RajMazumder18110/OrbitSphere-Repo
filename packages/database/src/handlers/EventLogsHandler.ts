/** @notice library imports */
import { desc } from "drizzle-orm";
/// Local imports
import {
  tenantsTable,
  rentalLogsTable,
  terminateLogsTable,
  type CreateRentalLogParams,
  type CreateTerminationLogParams,
} from "@/schemas";
import type { DBType } from "./OrbitSphereBase";

export class OrbitSphereEventsHandler {
  constructor(private connection: DBType) {}
  public recordRentalLog(data: CreateRentalLogParams) {
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
    });
  }

  public getLastestRentalLog() {
    return this.connection.query.rentalLogsTable.findFirst({
      orderBy: desc(rentalLogsTable.blockNumber),
    });
  }

  public recordTerminationLog(data: CreateTerminationLogParams) {
    return this.connection.insert(terminateLogsTable).values({
      ...data,
      tenant: data.tenant.toLowerCase(),
    });
  }

  public getLastestTerminationLog() {
    return this.connection.query.terminateLogsTable.findFirst({
      orderBy: desc(terminateLogsTable.blockNumber),
    });
  }
}
