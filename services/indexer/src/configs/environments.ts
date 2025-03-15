/// Type
type Environments = {
  /// Blockchain
  ORBIT_SPHERE_CONTRACT: string;
  BLOCKCHAIN_RPC_ENDPOINT: string;
  ORBIT_SPHERE_CONTRACT_DEPLOYED_ON_BLOCK: string;
  /// Application
  DATABASE_CONNECTION_URL: string;
  KAFKA_CONNECTION_URL: string;
};

/// Exports
export const environment = process.env as Environments;
