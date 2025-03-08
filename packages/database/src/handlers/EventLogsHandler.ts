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
import OrbitSphereDatabase from "./OrbitSphereBase";

export class OrbitSphereEventsHandler extends OrbitSphereDatabase {
  public recordRentalLog(data: CreateRentalLogParams) {
    return this.orbitSphereDatabase.transaction(async (tx) => {
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
    return this.orbitSphereDatabase.query.rentalLogsTable.findFirst({
      orderBy: desc(rentalLogsTable.blockNumber),
    });
  }

  public recordTerminationLog(data: CreateTerminationLogParams) {
    return this.orbitSphereDatabase.insert(terminateLogsTable).values({
      ...data,
      tenant: data.tenant.toLowerCase(),
    });
  }

  public getLastestTerminationLog() {
    return this.orbitSphereDatabase.query.terminateLogsTable.findFirst({
      orderBy: desc(terminateLogsTable.blockNumber),
    });
  }
}
