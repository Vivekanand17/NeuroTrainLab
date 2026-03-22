import React from "react";
import "./Card.css";

export function Card({ children, className = "", variant = "default", ...rest }) {
  const v = variant === "glass" ? "ntl-card ntl-card--glass" : "ntl-card";
  return (
    <div className={`${v} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`ntl-card__header ${className}`.trim()}>{children}</div>;
}

export function CardTitle({ children, icon }) {
  return (
    <h2 className="ntl-card__title">
      {icon ? <span className="ntl-card__title-icon">{icon}</span> : null}
      {children}
    </h2>
  );
}

export function CardDescription({ children }) {
  return <p className="ntl-card__desc">{children}</p>;
}

export function CardBody({ children, className = "" }) {
  return <div className={`ntl-card__body ${className}`.trim()}>{children}</div>;
}
