/** @notice Library imports */
import {
  drizzle,
  NodePgDatabase,
  type NodePgClient,
} from "drizzle-orm/node-postgres";
/// Loca imports
import * as schema from "@/schemas";

class OrbitSphereBase {
  protected orbitSphereDatabase: NodePgDatabase<typeof schema> & {
    $client: NodePgClient;
  };

  constructor(connectionUrl: string) {
    this.orbitSphereDatabase = drizzle(connectionUrl, { schema });
  }
}

export default OrbitSphereBase;
