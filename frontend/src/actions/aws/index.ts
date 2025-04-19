"use server";
/** @notice Library imports */
import type { RunningInstanceParams } from "@orbitsphere/aws";
/// Local imports
import { aws } from "@/actions/clients";

/// Getting Instance status.
export const getSphereStatusWithServerAction = async (
  params: RunningInstanceParams
) => await aws.getInstanceStatus(params);
