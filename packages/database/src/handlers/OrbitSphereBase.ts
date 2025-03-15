/** @notice Library imports */
import {
  drizzle,
  NodePgDatabase,
  type NodePgClient,
} from "drizzle-orm/node-postgres";
/// Loca imports
import * as schema from "../schemas";
import { OrbitSphereEventsIndexer } from "./indexer";
import { OrbitSphereRegionsHandler } from "./regionHandler";
import { OrbitSphereSpheresHandler } from "./sphereHandler";
import { OrbitSphereInstanceHandler } from "./InstanceHandler";

/// Exports
export type DBType = NodePgDatabase<typeof schema> & {
  $client: NodePgClient;
};

export class OrbitSphereDatabase {
  protected connection: DBType;

  public indexer: OrbitSphereEventsIndexer;
  public regions: OrbitSphereRegionsHandler;
  public spheres: OrbitSphereSpheresHandler;
  public instances: OrbitSphereInstanceHandler;

  constructor(connectionUrl: string) {
    this.connection = drizzle(connectionUrl, { schema });

    /// Initializing handlers
    this.indexer = new OrbitSphereEventsIndexer(this.connection);
    this.regions = new OrbitSphereRegionsHandler(this.connection);
    this.spheres = new OrbitSphereSpheresHandler(this.connection);
    this.instances = new OrbitSphereInstanceHandler(this.connection);
  }
}
