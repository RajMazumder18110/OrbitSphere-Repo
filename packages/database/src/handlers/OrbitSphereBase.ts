/** @notice Library imports */
import {
  drizzle,
  NodePgDatabase,
  type NodePgClient,
} from "drizzle-orm/node-postgres";
/// Loca imports
import * as schema from "@/schemas";

/// Type
type Environments = {
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_PASSWORD: string;
};

/// Exports
export const environment = process.env as Environments;

class OrbitSphereBase {
  protected orbitSphereDatabase: NodePgDatabase<typeof schema> & {
    $client: NodePgClient;
  };

  public static get databaseUrl() {
    return `postgres://${environment.POSTGRES_USER}:${environment.POSTGRES_PASSWORD}@${environment.POSTGRES_HOST}:${environment.POSTGRES_PORT}/${environment.POSTGRES_DB}`;
  }

  constructor(connectionUrl: string) {
    this.orbitSphereDatabase = drizzle(connectionUrl, { schema });
  }
}

export default OrbitSphereBase;
