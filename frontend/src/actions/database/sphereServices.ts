"use server";
/** @notice Library imports */
import { asc, eq } from "drizzle-orm";
/// Local imports
import { database } from "./database";
import { spheresTable } from "@orbitsphere/database/schemas";

export const getAllSpheres = async () => {
  return database.query.spheresTable.findMany({
    orderBy: asc(spheresTable.hourlyRate),
  });
};
