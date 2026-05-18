const env = import.meta.env.VITE_APP_ENV || import.meta.env.MODE;

const getApiUrl = (): string => {
  if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;
  if (env === "dev" || env === "development") return "http://10.150.5.42:5150/api/v1";
  if (env === "staging") return import.meta.env.VITE_STAGING_API_URL || "https://sdeiaiml.com:9214/api/v1";
  if (env === "production") return import.meta.env.VITE_PRODUCTION_API_URL || "https://api.aegisai.com/api/v1";
  return "http://localhost:9213/api/v1";
};

export default { API_URL: getApiUrl(), ENV: env };
export const API_URL = getApiUrl();
export const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || "";
