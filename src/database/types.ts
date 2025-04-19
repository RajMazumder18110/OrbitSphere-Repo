/** @notice Local imports */
import type { InstanceStatus } from "./schemas";

export type PaginatedGetInstanceParams = {
  page?: number;
  address: string;
  status: InstanceStatus;
};
