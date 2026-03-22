import React from "react";
import { Sidebar } from "../components/Sidebar";
import "./DashboardLayout.css";

export function DashboardLayout({ topbar, children }) {
  return (
    <div className="ntl-shell">
      <Sidebar />
      <div className="ntl-shell__main">
        {topbar}
        <div className="ntl-shell__content">{children}</div>
      </div>
    </div>
  );
}

export default DashboardLayout;
