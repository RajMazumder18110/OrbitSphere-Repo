/** @notice Library imports */
import {
  drizzle,
  NodePgDatabase,
  type NodePgClient,
} from "drizzle-orm/node-postgres";
/// Loca imports
import * as schema from "../schemas";
import { OrbitSphereEventsHandler } from "./EventLogsHandler";
import { OrbitSphereInstanceHandler } from "./InstanceHandler";

/// Type
type Environments = {
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_PASSWORD: string;
};

/// Exports
export type DBType = NodePgDatabase<typeof schema> & {
  $client: NodePgClient;
};
export const environment = process.env as Environments;

export class OrbitSphereDatabase {
  protected connection: DBType;

  public events: OrbitSphereEventsHandler;
  public instances: OrbitSphereInstanceHandler;

  public static get databaseUrl() {
    return `postgres://${environment.POSTGRES_USER}:${environment.POSTGRES_PASSWORD}@${environment.POSTGRES_HOST}:${environment.POSTGRES_PORT}/${environment.POSTGRES_DB}`;
  }

  constructor(connectionUrl: string) {
    this.connection = drizzle(connectionUrl, { schema });
    this.events = new OrbitSphereEventsHandler(this.connection);
    this.instances = new OrbitSphereInstanceHandler(this.connection);
  }
}
