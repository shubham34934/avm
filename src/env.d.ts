/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly MODE: string;
  readonly DEV: boolean;
  readonly PROD: boolean;
  // Add other environment variables you're using
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
