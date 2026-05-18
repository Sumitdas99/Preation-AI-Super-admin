export const IS_DEV = import.meta.env.DEV;

export const USE_MSW =
  IS_DEV && import.meta.env.VITE_USE_MSW === "true";

export const API_BASE_URL = (() => {
  const url = import.meta.env.VITE_API_BASE_URL ?? "";
  if (url.endsWith("/api/v1")) {
    return url.slice(0, -"/api/v1".length);
  }
  if (url.endsWith("/api/v1/")) {
    return url.slice(0, -"/api/v1/".length);
  }
  return url;
})();
