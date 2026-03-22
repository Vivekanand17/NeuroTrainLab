import BASE_URL from "../config";
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
  document.getElementById(id)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
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
    if (hp.max_depth != null)
      rows.push({ key: "max_depth", label: "Max depth", value: hp.max_depth });

    if (hp.min_samples_leaf != null)
      rows.push({
        key: "min_samples_leaf",
        label: "Min samples leaf",
        value: hp.min_samples_leaf,
      });

    if (hp.random_state != null)
      rows.push({
        key: "random_state",
        label: "Random state",
        value: hp.random_state,
      });
  }

  if (modelType === "random_forest") {
    if (hp.n_estimators != null)
      rows.push({
        key: "n_estimators",
        label: "N estimators",
        value: hp.n_estimators,
      });

    rows.push({
      key: "max_depth",
      label: "Max depth",
      value: hp.max_depth == null ? "Unlimited (none)" : hp.max_depth,
    });

    if (hp.random_state != null)
      rows.push({
        key: "random_state",
        label: "Random state",
        value: hp.random_state,
      });

    if (hp.min_samples_leaf != null)
      rows.push({
        key: "min_samples_leaf",
        label: "Min samples leaf",
        value: hp.min_samples_leaf,
      });
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
}) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

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

  // ✅ NEW API FUNCTION
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
            max_depth:
              modelType === "tree" ? maxDepth : rfMaxDepth || null,
            n_estimators:
              modelType === "random_forest" ? nEstimators : null,
            random_state: randomState,
          },
        }),
      });

      const data = await response.json();

      console.log("✅ Training Result:", data);

      if (handleTrain) {
        handleTrain(data);
      }
    } catch (error) {
      console.error("❌ API Error:", error);
    }
  };

  return (
    <>
      <PipelineSteps
        activeIndex={activeIndex}
        onStepClick={(stepId) => {
          const sid = STEP_SCROLL[stepId];
          if (sid) scrollToSection(sid);
        }}
      />

      {/* UPLOAD */}
      <section id="section-upload" className="ntl-section">
        <Card variant="glass">
          <CardHeader>
            <CardTitle icon={<IconUpload />}>Upload Data</CardTitle>
            <CardDescription>
              Import your CSV to begin exploratory analysis and training.
            </CardDescription>
          </CardHeader>
          <CardBody>
            <UploadForm
              onUploadSuccess={onUploadSuccess}
              onLoadingChange={onUploadLoadingChange}
            />
          </CardBody>
        </Card>
      </section>

      {/* TRAIN */}
      {cleaned && (
        <section id="section-train" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconCpu />}>Train Model</CardTitle>
              <CardDescription>
                Choose algorithm and run training.
              </CardDescription>
            </CardHeader>
            <CardBody>

              <select
                value={modelType}
                onChange={(e) => setModelType(e.target.value)}
              >
                <option value="linear">Linear</option>
                <option value="tree">Tree</option>
                <option value="random_forest">Random Forest</option>
              </select>

              <Button
                variant="primary"
                size="lg"
                onClick={handleTrainAPI}   // ✅ UPDATED
                disabled={training}
                loading={training}
              >
                {training ? "Training…" : "Run training"}
              </Button>
            </CardBody>
          </Card>
        </section>
      )}

      {/* RESULTS */}
      {trainingResults && (
        <section id="section-results" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconChart />}>
                Analyze Results
              </CardTitle>
            </CardHeader>

            <CardBody>
              <MetricsChart trainingResults={trainingResults} />
              <LearningCurvesPlaceholder />
            </CardBody>
          </Card>
        </section>
      )}
    </>
  );
}

// ✅ FIXED ERROR HERE
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