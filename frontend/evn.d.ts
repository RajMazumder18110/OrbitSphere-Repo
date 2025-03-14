declare namespace NodeJS {
  interface ProcessEnv {
    // Blockchain
    USDC: string;
    ORBIT_SPHERE_CONTRACT: string;

    // Database
    DATABASE_CONNECTION_URL: string;
    // AWS
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;

    // Frontend
    COOKIE_SECRET: string;
    DEFAULT_PAGE_LIMIT: string; // It's stored as a string in env, convert to number in code if needed
    MINIMUM_TIME_TO_RENT: string; // It's stored as a string in env, convert to number in code if needed
  }
}
