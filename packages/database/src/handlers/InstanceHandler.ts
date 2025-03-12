/** @notice library imports */
import { and, eq, gt, lte, or, sql } from "drizzle-orm";
/// Local imports
import {
  instancesTable,
  InstanceStatus,
  type CreateInstanceParams,
} from "@/schemas";
import type { DBType } from "./OrbitSphereBase";

export class OrbitSphereInstanceHandler {
  constructor(private connection: DBType) {}

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

  public async getInstancesByStatus(params: {
    page?: number;
    limit?: number;
    status: InstanceStatus;
  }) {
    /// Where condition
    let whereCondition;
    if (params.status === InstanceStatus.TERMINATED) {
      whereCondition = eq(instancesTable.status, params.status);
    } else if (params.status === InstanceStatus.QUEUED) {
      whereCondition = or(
        eq(instancesTable.status, InstanceStatus.QUEUED),
        lte(instancesTable.willBeEndOn, sql`now()`)
      );
    } else {
      whereCondition = and(
        eq(instancesTable.status, InstanceStatus.RUNNING),
        gt(instancesTable.willBeEndOn, sql`now()`)
      );
    }

    /// Pagination
    const limit = (params.limit ?? 8) >= 8 ? 8 : params.limit;
    const offset = ((params.page ?? 0) - 1) * limit!;

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

  public async terminate(instanceId: string) {
    return this.connection
      .update(instancesTable)
      .set({
        status: InstanceStatus.TERMINATED,
      })
      .where(eq(instancesTable.instanceId, instanceId));
  }
}
