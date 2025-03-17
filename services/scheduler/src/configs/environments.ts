/// Type
type Environments = {
  BLOCKCHAIN_RPC_ENDPOINT: string;
  ORBIT_SPHERE_CONTRACT: string;
  KAFKA_CONNECTION_URL: string;
  ORBIT_SPHERE_TERMINATOR_PRIV_KEY: string;
};

/// Exports
export const environment = process.env as Environments;
