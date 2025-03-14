/** @notice library imports */
import { asc } from "drizzle-orm";
/// Local imports
import type { DBType } from "./OrbitSphereBase";
import { spheresTable, type CreateSphereParams } from "../schemas";

export class OrbitSphereSpheresHandler {
  constructor(private connection: DBType) {}

  public async getActiveSpheres() {
    return this.connection.query.spheresTable.findMany({
      orderBy: asc(spheresTable.hourlyRate),
    });
  }

  public async create(data: CreateSphereParams) {
    return this.connection.insert(spheresTable).values(data);
  }
}
