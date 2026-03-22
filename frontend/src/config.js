/**
 * Local: optional `.env` / `.env.local` with VITE_API_URL=http://localhost:8000
 * Render: set VITE_API_URL to your FastAPI URL (baked in at build time).
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default API_BASE_URL;
