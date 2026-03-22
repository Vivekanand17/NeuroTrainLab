import BASE_URL from "../config"; // ✅ ADDED
import React, { useState, useMemo } from "react";
import UploadForm from "../components/UploadForm";
import MetricsChart from "../components/MetricsChart";
import { LearningCurvesPlaceholder } from "../components/LearningCurvesPlaceholder";
import { PipelineSteps, getPipelineActiveIndex } from "../components/PipelineSteps";
import { Card, CardBody, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { IconUpload, IconSparkles, IconCpu, IconChart } from "../components/icons";
import "../components/ui/FormControls.css";
import "./DashboardPage.css";

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

const STEP_SCROLL = {
  upload: "section-upload",
  clean: "section-summary",
  train: "section-train",
  analyze: "section-results",
};

const MODEL_LABELS = {
  linear: "Linear Regression",
  tree: "Decision Tree Regressor",
  random_forest: "Random Forest Regressor",
};

function formatHyperparameterRows(modelType, hp) {
  if (!hp || modelType === "linear") return [];
  const rows = [];
  if (modelType === "tree") {
    if (hp.max_depth != null) rows.push({ key: "max_depth", label: "Max depth", value: hp.max_depth });
    if (hp.min_samples_leaf != null) rows.push({ key: "min_samples_leaf", label: "Min samples leaf", value: hp.min_samples_leaf });
    if (hp.random_state != null) rows.push({ key: "random_state", label: "Random state", value: hp.random_state });
  }
  if (modelType === "random_forest") {
    if (hp.n_estimators != null) rows.push({ key: "n_estimators", label: "N estimators", value: hp.n_estimators });
    rows.push({
      key: "max_depth",
      label: "Max depth",
      value: hp.max_depth == null ? "Unlimited (none)" : hp.max_depth,
    });
    if (hp.random_state != null) rows.push({ key: "random_state", label: "Random state", value: hp.random_state });
    if (hp.min_samples_leaf != null) rows.push({ key: "min_samples_leaf", label: "Min samples leaf", value: hp.min_samples_leaf });
  }
  return rows;
}

export default function DashboardPage({
  eda,
  trainingResults,
  modelType,
  setModelType,
  maxDepth,
  setMaxDepth,
  nEstimators,
  setNEstimators,
  rfMaxDepth,
  setRfMaxDepth,
  randomState,
  setRandomState,
  training,
  cleaning,
  cleaned,
  onUploadSuccess,
  onUploadLoadingChange,
  handleClean,
  handleTrain,
  targetCol,
  setTargetCol,
  apiBaseUrl,
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // ✅ ADDED API FUNCTION
  const handleTrainAPI = async () => {
    try {
      const response = await fetch(`${BASE_URL}/predict`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model_type: modelType,
          target_col: targetCol,
          hyperparameters: {
            max_depth: modelType === "tree" ? maxDepth : rfMaxDepth || null,
            n_estimators: modelType === "random_forest" ? nEstimators : null,
            random_state: randomState,
          },
        }),
      });

      const data = await response.json();

      console.log("✅ Training Result:", data);

      // send result to parent (important)
      if (handleTrain) {
        handleTrain(data);
      }

    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  const activeIndex = useMemo(
    () =>
      getPipelineActiveIndex({
        eda,
        cleaned,
        training,
        trainingResults,
      }),
    [eda, cleaned, training, trainingResults]
  );

  return (
    <>
      <PipelineSteps
        activeIndex={activeIndex}
        onStepClick={(stepId) => {
          const sid = STEP_SCROLL[stepId];
          if (sid) scrollToSection(sid);
        }}
      />

      {/* ---- everything SAME ---- */}

      {cleaned ? (
        <section id="section-train" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconCpu />}>Train Model</CardTitle>
              <CardDescription>Choose an algorithm and hyperparameters, then launch training.</CardDescription>
            </CardHeader>
            <CardBody>

              {/* ---- your full UI remains SAME ---- */}

              <Button
                variant="primary"
                size="lg"
                onClick={handleTrainAPI} // ✅ UPDATED HERE
                disabled={training}
                loading={training}
              >
                {training ? "Training…" : "Run training"}
              </Button>

            </CardBody>
          </Card>
        </section>
      ) : null}

      {/* ---- rest code SAME ---- */}
    </>
  );
}

function DiagnosticRow({ message }) {
  const ok = message.includes("✅");
  const warn = message.includes("⚠️");
  const variant = ok ? "ok" : warn ? "warn" : "err";
  return (
    <div className={`ntl-diag ntl-diag--${variant}`} role="status">
      {message}
    </div>
  );
}