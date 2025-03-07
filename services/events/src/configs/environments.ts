/// Type
type Environments = {
  POSTGRES_DB: string;
  POSTGRES_USER: string;
  POSTGRES_HOST: string;
  POSTGRES_PORT: string;
  POSTGRES_PASSWORD: string;
  ORBIT_SPHERE_CONTRACT: string;
  BLOCKCHAIN_RPC_ENDPOINT: string;
};

/// Exports
export const environment = process.env as Environments;
