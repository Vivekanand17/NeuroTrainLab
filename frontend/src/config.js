/**
 * Production: set REACT_APP_API_URL in Render (Static Site) environment variables
 * to your FastAPI service URL, e.g. https://neurotrain-lab-api.onrender.com
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export default API_BASE_URL;
