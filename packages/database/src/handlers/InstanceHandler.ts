/** @notice library imports */
import { eq } from "drizzle-orm";
/// Local imports
import type { DBType } from "./OrbitSphereBase";
import { instancesTable, type CreateInstanceParams } from "@/schemas";

export class OrbitSphereInstanceHandler {
  constructor(private connection: DBType) {}

  public async getInstanceBySphereId(id: bigint) {
    return this.connection.query.instancesTable.findFirst({
      where: eq(instancesTable.sphereId, id),
    });
  }

  public async getInstanceByInstanceId(id: string) {
    return this.connection.query.instancesTable.findFirst({
      where: eq(instancesTable.instanceId, id),
    });
  }

  public async create(data: CreateInstanceParams) {
    return this.connection.insert(instancesTable).values({
      ...data,
      tenant: data.tenant.toLocaleLowerCase(),
    });
  }
}
