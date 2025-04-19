/// Type
type Environments = {
  /// Blockchain
  ORBIT_SPHERE_CONTRACT: string;
  BLOCKCHAIN_RPC_ENDPOINT: string;
  ORBIT_SPHERE_CONTRACT_DEPLOYED_ON_BLOCK: string;
  ORBIT_SPHERE_TERMINATOR_PRIV_KEY: string;
  /// Application
  DATABASE_CONNECTION_URL: string;
  /// AWS
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
};

/// Exports
export const environment = process.env as Environments;
