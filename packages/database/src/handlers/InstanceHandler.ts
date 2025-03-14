/** @notice library imports */
import { and, eq, gt, lte, or, sql } from "drizzle-orm";
/// Local imports
import {
  instancesTable,
  InstanceStatus,
  type CreateInstanceParams,
  type TerminateInstanceParams,
} from "../schemas";
import type { DBType } from "./OrbitSphereBase";
import type { PaginatedGetInstanceParams } from "../types";

export class OrbitSphereInstanceHandler {
  constructor(private connection: DBType) {}

  public async getInstanceBySphereId(sphereId: bigint) {
    return this.connection.query.instancesTable.findFirst({
      where: eq(instancesTable.sphereId, sphereId),
      with: {
        sphere: true,
        region: true,
        tenant: true,
      },
    });
  }

  public async getInstanceByInstanceId(id: string) {
    return this.connection.query.instancesTable.findFirst({
      where: eq(instancesTable.instanceId, id),
      with: {
        sphere: true,
        region: true,
        tenant: true,
      },
    });
  }

  public async getInstancesByStatus(params: PaginatedGetInstanceParams) {
    /// Where condition
    let whereCondition;
    if (params.status === InstanceStatus.TERMINATED) {
      whereCondition = and(
        eq(instancesTable.status, params.status),
        eq(instancesTable.tenant, params.address.toLowerCase())
      );
    } else if (params.status === InstanceStatus.QUEUED) {
      whereCondition = and(
        or(
          eq(instancesTable.status, InstanceStatus.QUEUED),
          and(
            eq(instancesTable.status, InstanceStatus.RUNNING),
            lte(instancesTable.willBeEndOn, sql`now()`)
          )
        ),
        eq(instancesTable.tenant, params.address.toLowerCase())
      );
    } else {
      whereCondition = and(
        eq(instancesTable.status, InstanceStatus.RUNNING),
        gt(instancesTable.willBeEndOn, sql`now()`),
        eq(instancesTable.tenant, params.address.toLowerCase())
      );
    }

    /// Pagination
    const limit = (params.limit ?? 8) >= 8 ? 8 : params.limit;
    const offset = ((params.page ?? 1) - 1) * limit!;

    return this.connection.query.instancesTable.findMany({
      offset,
      limit,
      with: {
        sphere: true,
        region: true,
        tenant: true,
      },
      where: whereCondition,
    });
  }

  public async create(data: CreateInstanceParams) {
    return this.connection.insert(instancesTable).values({
      ...data,
      tenant: data.tenant.toLocaleLowerCase(),
    });
  }

  public async terminate(data: TerminateInstanceParams) {
    return this.connection
      .update(instancesTable)
      .set({
        ...data,
        status: InstanceStatus.TERMINATED,
      })
      .where(eq(instancesTable.instanceId, data.instanceId));
  }
}
