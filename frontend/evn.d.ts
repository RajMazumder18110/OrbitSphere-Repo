declare namespace NodeJS {
  interface ProcessEnv {
    // Blockchain
    NEXT_PUBLIC_USDC: string;
    NEXT_PUBLIC_ORBIT_SPHERE_CONTRACT: string;

    // Database
    DATABASE_CONNECTION_URL: string;
    // AWS
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;

    // Frontend
    COOKIE_SECRET: string;
    NEXT_PUBLIC_DEFAULT_PAGE_LIMIT: string; // It's stored as a string in env, convert to number in code if needed
    NEXT_PUBLIC_MINIMUM_TIME_TO_RENT: string; // It's stored as a string in env, convert to number in code if needed
  }
}
