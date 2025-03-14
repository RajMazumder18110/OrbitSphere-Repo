/// Type
type Environments = {
  BLOCKCHAIN_RPC_ENDPOINT: string;
  ORBIT_SPHERE_CONTRACT: string;
  KAFKA_CONNECTION_URL: string;
};

/// Exports
export const environment = process.env as Environments;
