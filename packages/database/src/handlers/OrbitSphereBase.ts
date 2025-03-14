/** @notice Library imports */
import {
  drizzle,
  NodePgDatabase,
  type NodePgClient,
} from "drizzle-orm/node-postgres";
/// Loca imports
import * as schema from "../schemas";
import { OrbitSphereRegionsHandler } from "./regionHandler";
import { OrbitSphereSpheresHandler } from "./sphereHandler";
import { OrbitSphereEventsHandler } from "./EventLogsHandler";
import { OrbitSphereInstanceHandler } from "./InstanceHandler";

/// Exports
export type DBType = NodePgDatabase<typeof schema> & {
  $client: NodePgClient;
};

export class OrbitSphereDatabase {
  protected connection: DBType;

  public events: OrbitSphereEventsHandler;
  public regions: OrbitSphereRegionsHandler;
  public spheres: OrbitSphereSpheresHandler;
  public instances: OrbitSphereInstanceHandler;

  constructor(connectionUrl: string) {
    this.connection = drizzle(connectionUrl, { schema });

    /// Initializing handlers
    this.events = new OrbitSphereEventsHandler(this.connection);
    this.regions = new OrbitSphereRegionsHandler(this.connection);
    this.spheres = new OrbitSphereSpheresHandler(this.connection);
    this.instances = new OrbitSphereInstanceHandler(this.connection);
  }
}
