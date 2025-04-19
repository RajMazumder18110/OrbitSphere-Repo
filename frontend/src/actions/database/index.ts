"use server";
/// Local imports
import { database } from "@/actions/clients";
import { PaginatedGetInstanceParams } from "@orbitsphere/database/handlers";

/// Getting all available regions
export const getAllRegionsWithServerAction = async () =>
  await database.regions.getActiveRegions();

/// Getting all available Spheres
export const getAllSpheresWithServerAction = async () =>
  await database.spheres.getActiveSpheres();

export const getSphereByInstanceIdWithServerAction = async (id: string) =>
  await database.instances.getInstanceByInstanceId(id);

export const getInstancesByStatusWithServerAction = async (
  params: PaginatedGetInstanceParams
) => await database.instances.getInstancesByStatus(params);
