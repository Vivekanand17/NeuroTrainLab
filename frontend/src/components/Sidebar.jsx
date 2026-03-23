import React from "react";
import { IconLayout, IconUpload, IconSparkles, IconCpu, IconChart } from "./icons";
import "./Sidebar.css";

const LINKS = [
  { id: "section-upload", label: "Upload", Icon: IconUpload },
  { id: "section-summary", label: "Clean & EDA", Icon: IconSparkles },
  { id: "section-train", label: "Train", Icon: IconCpu },
  { id: "section-results", label: "Analyze", Icon: IconChart },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  el?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function Sidebar() {
  return (
    <aside className="ntl-sidebar">
      <div className="ntl-sidebar__brand">
        <span className="ntl-sidebar__logo" aria-hidden>
          <IconLayout width={22} height={22} />
        </span>
        <div>
          <div className="ntl-sidebar__name">NeuroTrain Lab</div>
          <div className="ntl-sidebar__sub">Workspace</div>
        </div>
      </div>
      <p className="ntl-sidebar__section-label">Navigate</p>
      <nav className="ntl-sidebar__nav" aria-label="Primary">
        {LINKS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            className="ntl-sidebar__link"
            onClick={() => scrollToId(id)}
          >
            <span className="ntl-sidebar__link-icon" aria-hidden>
              <Icon width={18} height={18} />
            </span>
            {label}
          </button>
        ))}
      </nav>
      <div className="ntl-sidebar__footer">
        <div className="ntl-sidebar__foot-card">
          <strong>Pipeline</strong>
          <span>Upload → Clean → Train → Analyze</span>
        </div>
        <div className="ntl-sidebar__foot-card ntl-sidebar__foot-card--brand">
          © 2026 NeuroTrainLab | Developed by Vivtech.ai
        </div>
      </div>
    </aside>
  );
}
