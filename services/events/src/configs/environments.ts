/// Type
type Environments = {
  /// Blockchain
  ORBIT_SPHERE_CONTRACT: string;
  BLOCKCHAIN_RPC_ENDPOINT: string;
  /// Application
  DATABASE_CONNECTION_URL: string;
  KAFKA_CONNECTION_URL: string;
};

/// Exports
export const environment = process.env as Environments;
