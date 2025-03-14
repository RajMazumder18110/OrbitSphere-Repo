/** @notice library imports */
import { eq } from "drizzle-orm";
/// Local imports
import type { DBType } from "./OrbitSphereBase";
import { regionsTable, type CreateRegionParams } from "../schemas";

export class OrbitSphereRegionsHandler {
  constructor(private connection: DBType) {}

  public async getActiveRegions() {
    return this.connection.query.regionsTable.findMany({
      where: eq(regionsTable.isEnabled, true),
    });
  }

  public async create(data: CreateRegionParams) {
    return this.connection.insert(regionsTable).values(data);
  }
}
