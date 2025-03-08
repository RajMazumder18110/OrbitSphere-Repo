/** @notice Local imports */
import { OrbitSphereEventsHandler } from "./EventLogsHandler";

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

/// Exports main class
export class OrbitSphereDatabase {
  public events: OrbitSphereEventsHandler;

  public static get databaseUrl() {
    return `postgres://${environment.POSTGRES_USER}:${environment.POSTGRES_PASSWORD}@${environment.POSTGRES_HOST}:${environment.POSTGRES_PORT}/${environment.POSTGRES_DB}`;
  }

  constructor(connectionUrl: string) {
    this.events = new OrbitSphereEventsHandler(connectionUrl);
  }
}
