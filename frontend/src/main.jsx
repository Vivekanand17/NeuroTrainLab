import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import API_BASE_URL from "./config";

console.info("[NeuroTrain Lab] API base URL:", API_BASE_URL);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
