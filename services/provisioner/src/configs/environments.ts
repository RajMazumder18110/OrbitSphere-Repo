/// Type
type Environments = {
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
  RABBITMQ_CONNETION_URL: string;
};

/// Exports
export const environment = process.env as Environments;
