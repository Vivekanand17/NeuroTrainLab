import React from "react";
import { IconUpload, IconSparkles, IconCpu, IconChart } from "./icons";
import "./PipelineSteps.css";

const STEPS = [
  { id: "upload", label: "Upload Data", Icon: IconUpload },
  { id: "clean", label: "Clean Data", Icon: IconSparkles },
  { id: "train", label: "Train Model", Icon: IconCpu },
  { id: "analyze", label: "Analyze Results", Icon: IconChart },
];

export function PipelineSteps({ activeIndex, onStepClick }) {
  return (
    <nav className="ntl-pipeline" aria-label="ML pipeline progress">
      <ol className="ntl-pipeline__list">
        {STEPS.map((step, index) => {
          const done = index < activeIndex;
          const current = index === activeIndex;
          const Icon = step.Icon;
          return (
            <li key={step.id} className="ntl-pipeline__item">
              <button
                type="button"
                className={[
                  "ntl-pipeline__step",
                  done ? "ntl-pipeline__step--done" : "",
                  current ? "ntl-pipeline__step--current" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => onStepClick?.(step.id)}
              >
                <span className="ntl-pipeline__icon" aria-hidden>
                  <Icon />
                </span>
                <span className="ntl-pipeline__label">{step.label}</span>
              </button>
              {index < STEPS.length - 1 ? (
                <span className={`ntl-pipeline__connector ${done ? "ntl-pipeline__connector--done" : ""}`} aria-hidden />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function getPipelineActiveIndex({ eda, cleaned, training, trainingResults }) {
  if (trainingResults) return 3;
  if (training) return 2;
  if (cleaned) return 2;
  if (eda) return 1;
  return 0;
}
