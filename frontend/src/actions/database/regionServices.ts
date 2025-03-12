"use server";
/// Local imports
import { database } from "./database";

export const getAllRegions = async () => {
  return database.query.regionsTable.findMany();
};
