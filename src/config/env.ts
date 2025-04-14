/// <reference types="vite/client" />

// Environment Configuration
export const ENV = {
  NODE_ENV: import.meta.env.MODE,
  VITE_APP_API_URL:
    import.meta.env.VITE_APP_API_URL || "http://localhost:9002/api",
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};
