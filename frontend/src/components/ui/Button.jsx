import React from "react";
import "./Button.css";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  loading = false,
  disabled = false,
  type = "button",
  ...rest
}) {
  const classes = [
    "ntl-btn",
    `ntl-btn--${variant}`,
    `ntl-btn--${size}`,
    loading ? "ntl-btn--loading" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} disabled={disabled || loading} {...rest}>
      {loading ? <span className="ntl-btn__spinner" aria-hidden /> : null}
      <span>{children}</span>
    </button>
  );
}
