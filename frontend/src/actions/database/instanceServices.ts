"use server";
/** @notice Library imports */
import { and, eq, gt, lte, or, sql } from "drizzle-orm";
import {
  Instance,
  instancesTable,
  InstanceStatus,
  Region,
  Sphere,
  Tenant,
} from "@orbitsphere/database/schemas";
/// Local imports
import { database } from "./database";

/// Types
export type IInstance = Instance & {
  sphere: string & Sphere;
  region: string & Region;
  tenant: string & Tenant;
};

export const getInstanceByInstanceId = async (id: string) => {
  return database.query.instancesTable.findFirst({
    where: eq(instancesTable.instanceId, id),
    with: {
      sphere: true,
      region: true,
      tenant: true,
    },
  });
};

export const getInstancesByStatus = async (params: {
  page?: number;
  limit?: number;
  status: InstanceStatus;
  address: string;
}) => {
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

  return database.query.instancesTable.findMany({
    offset,
    limit,
    with: {
      sphere: true,
      region: true,
      tenant: true,
    },
    where: whereCondition,
  });
};
