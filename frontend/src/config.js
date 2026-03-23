/**
 * Local: VITE_API_URL in .env or .env.local (default http://localhost:8000)
 * Render: set VITE_API_URL to your FastAPI URL before building.
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export default API_BASE_URL;