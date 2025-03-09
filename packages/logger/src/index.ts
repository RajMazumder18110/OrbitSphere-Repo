/** @notice library imports  */
import winston from "winston";

export const createOrbitSphereLogger = (serviceName: string) =>
  winston.createLogger({
    level: "info",
    defaultMeta: {
      application: `@OrbitSphere/${serviceName}`,
    },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new winston.transports.Console({
        level: "info",
      }),
    ],
  });
