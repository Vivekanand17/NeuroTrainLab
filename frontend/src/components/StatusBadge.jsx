import React from "react";
import "./StatusBadge.css";

export function StatusBadge({ status = "idle", label }) {
  const map = {
    idle: { className: "ntl-status ntl-status--idle", defaultText: "Ready" },
    busy: { className: "ntl-status ntl-status--busy", defaultText: "Working" },
    success: { className: "ntl-status ntl-status--success", defaultText: "Diagnostics ready" },
  };
  const cfg = map[status] || map.idle;
  const text = label ?? cfg.defaultText;
  return (
    <span className={cfg.className}>
      <span className="ntl-status__dot" />
      {text}
    </span>
  );
}
