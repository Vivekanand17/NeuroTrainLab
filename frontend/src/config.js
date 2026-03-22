/**
 * Central API Configuration
 * Uses environment variable if available, otherwise falls back to Render URL
 */
const BASE_URL =
  import.meta.env.VITE_API_URL || "https://neurotrainlab.onrender.com";

export default BASE_URL;