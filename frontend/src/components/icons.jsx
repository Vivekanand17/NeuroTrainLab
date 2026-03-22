import React from "react";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function IconUpload(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

export function IconSparkles(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M12 3l1.2 4.5L18 9l-4.8 1.5L12 15l-1.2-4.5L6 9l4.8-1.5L12 3z" />
      <path d="M19 3v2M19 19v2M3 19v2M3 3v2" />
    </svg>
  );
}

export function IconCpu(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <rect x="9" y="9" width="6" height="6" />
      <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
    </svg>
  );
}

export function IconChart(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M3 3v18h18" />
      <path d="M7 12v5M12 8v9M17 5v12" />
    </svg>
  );
}

export function IconLayout(props) {
  return (
    <svg {...iconProps} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M3 9h18M9 21V9" />
    </svg>
  );
}

export function IconActivity(props) {
  return (
    <svg {...iconProps} {...props}>
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
