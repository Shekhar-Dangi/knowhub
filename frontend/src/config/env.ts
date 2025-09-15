export const env = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3001",
} as const;

if (!env.API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL environment variable is required");
}
