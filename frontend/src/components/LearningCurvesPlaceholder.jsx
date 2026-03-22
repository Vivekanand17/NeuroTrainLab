import React from "react";
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from "./ui/Card";
import "./LearningCurvesPlaceholder.css";

/**
 * Placeholder for future learning-curve plots (e.g. score vs training set size).
 * Linear / tree / RF here report final split metrics; iterative models would use epoch curves.
 */
export function LearningCurvesPlaceholder() {
  return (
    <div className="ntl-lc-placeholder">
      <Card variant="glass">
        <CardHeader>
          <CardTitle>Learning curves</CardTitle>
          <CardDescription>Planned for a future release.</CardDescription>
        </CardHeader>
        <CardBody>
          <p className="ntl-lc-placeholder__text">
            We may add <strong>learning curves</strong> (performance vs. training-set size) to complement the current
            train / validation / test metrics. That helps diagnose bias and variance when you can grow the dataset.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
