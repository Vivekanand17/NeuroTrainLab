import React from "react";
import { StatusBadge } from "./StatusBadge";
import "./Topbar.css";

export function Topbar({ status = "idle", statusLabel }) {
  return (
    <header className="ntl-topbar">
      <div className="ntl-topbar__titles">
        <h1 className="ntl-topbar__title">NeuroTrain Lab</h1>
        <p className="ntl-topbar__tagline">Train Smarter. Diagnose Faster.</p>
      </div>
      <StatusBadge status={status} label={statusLabel} />
    </header>
  );
}
