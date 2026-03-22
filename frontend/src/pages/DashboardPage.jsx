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

      <div className="ntl-mobile-bar">
        <button
          type="button"
          className="ntl-mobile-bar__btn"
          onClick={() => setMobileNavOpen((o) => !o)}
          aria-expanded={mobileNavOpen}
        >
          {mobileNavOpen ? "Hide quick nav" : "Quick nav"}
        </button>
        {mobileNavOpen ? (
          <div className="ntl-mobile-bar__links">
            {Object.entries(STEP_SCROLL).map(([key, id]) => (
              <button key={key} type="button" className="ntl-mobile-bar__link" onClick={() => scrollToSection(id)}>
                {key}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <section id="section-upload" className="ntl-section">
        <Card variant="glass">
          <CardHeader>
            <CardTitle icon={<IconUpload />}>Upload Data</CardTitle>
            <CardDescription>Import your CSV to begin exploratory analysis and training.</CardDescription>
          </CardHeader>
          <CardBody>
            <UploadForm onUploadSuccess={onUploadSuccess} apiBaseUrl={apiBaseUrl} onLoadingChange={onUploadLoadingChange} />
          </CardBody>
        </Card>
      </section>

      {!eda ? (
        <div className="ntl-empty">
          <div className="ntl-empty__glow" aria-hidden />
          <h3 className="ntl-empty__title">Start with your dataset</h3>
          <p className="ntl-empty__text">
            Upload a CSV, then choose which column to predict (defaults to <span className="mono">target</span> if
            present, otherwise the last column).
          </p>
        </div>
      ) : null}

      {eda ? (
        <section id="section-summary" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconSparkles />}>Clean Data</CardTitle>
              <CardDescription>Review EDA summary, then impute missing values before training.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="ntl-kv-grid">
                <div className="ntl-kv">
                  <span className="ntl-kv__k">Shape</span>
                  <span className="ntl-kv__v mono">
                    {eda.shape[0]} × {eda.shape[1]}
                  </span>
                </div>
                <div className="ntl-kv ntl-kv--wide">
                  <span className="ntl-kv__k">Columns</span>
                  <span className="ntl-kv__v">{eda.columns.join(", ")}</span>
                </div>
              </div>
              <p className="ntl-label" style={{ marginTop: "1rem" }}>
                Data types
              </p>
              <pre className="ntl-pre">{JSON.stringify(eda.dtypes, null, 2)}</pre>
              <p className="ntl-label">Missing values</p>
              <pre className="ntl-pre">{JSON.stringify(eda.missing_count, null, 2)}</pre>
              <Button
                variant={cleaned ? "success" : "primary"}
                onClick={handleClean}
                disabled={cleaned || cleaning}
                loading={cleaning}
              >
                {cleaned ? "Data cleaned" : cleaning ? "Cleaning…" : "Clean data (mean imputation)"}
              </Button>
            </CardBody>
          </Card>
        </section>
      ) : null}

      {cleaned ? (
        <section id="section-train" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconCpu />}>Train Model</CardTitle>
              <CardDescription>Choose an algorithm and hyperparameters, then launch training.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="ntl-field-row">
                <div>
                  <label className="ntl-label" htmlFor="target-col">
                    Target column (what to predict)
                  </label>
                  <select
                    id="target-col"
                    className="ntl-select ntl-select--wide"
                    value={targetCol}
                    onChange={(e) => setTargetCol(e.target.value)}
                  >
                    {(eda?.columns || []).map((col) => (
                      <option key={col} value={col}>
                        {col}
                      </option>
                    ))}
                  </select>
                  <span className="ntl-hint">
                    Must match a column in your cleaned CSV. All other columns are used as features.
                  </span>
                </div>
                <div>
                  <label className="ntl-label" htmlFor="model-type">
                    Model type
                  </label>
                  <select
                    id="model-type"
                    className="ntl-select"
                    value={modelType}
                    onChange={(e) => setModelType(e.target.value)}
                  >
                    <option value="linear">Linear Regression</option>
                    <option value="tree">Decision Tree Regressor</option>
                    <option value="random_forest">Random Forest Regressor</option>
                  </select>
                </div>
              </div>
              {modelType === "tree" ? (
                <div className="ntl-field-row">
                  <div>
                    <label className="ntl-label" htmlFor="max-depth">
                      Max depth
                    </label>
                    <input
                      id="max-depth"
                      type="number"
                      className="ntl-input"
                      value={maxDepth}
                      onChange={(e) => setMaxDepth(parseInt(e.target.value, 10) || 1)}
                      min={1}
                      max={20}
                    />
                    <span className="ntl-hint">Higher depth increases complexity and overfitting risk.</span>
                  </div>
                </div>
              ) : null}
              {modelType === "random_forest" ? (
                <>
                  <div className="ntl-field-row">
                    <div>
                      <label className="ntl-label" htmlFor="n-estimators">
                        N estimators
                      </label>
                      <input
                        id="n-estimators"
                        type="number"
                        className="ntl-input"
                        value={nEstimators}
                        onChange={(e) => setNEstimators(Math.max(1, parseInt(e.target.value, 10) || 100))}
                        min={1}
                        max={2000}
                      />
                      <span className="ntl-hint">Number of trees in the forest (default 100).</span>
                    </div>
                    <div>
                      <label className="ntl-label" htmlFor="rf-max-depth">
                        Max depth (optional)
                      </label>
                      <input
                        id="rf-max-depth"
                        type="number"
                        className="ntl-input"
                        value={rfMaxDepth}
                        onChange={(e) => setRfMaxDepth(e.target.value)}
                        min={1}
                        max={50}
                        placeholder="Unlimited"
                      />
                      <span className="ntl-hint">Leave empty for no depth limit (sklearn default).</span>
                    </div>
                    <div>
                      <label className="ntl-label" htmlFor="random-state">
                        Random state
                      </label>
                      <input
                        id="random-state"
                        type="number"
                        className="ntl-input"
                        value={randomState}
                        onChange={(e) => setRandomState(parseInt(e.target.value, 10) || 0)}
                      />
                      <span className="ntl-hint">Seed for reproducibility (default 42).</span>
                    </div>
                  </div>
                </>
              ) : null}
              <Button variant="primary" size="lg" onClick={handleTrain} disabled={training} loading={training}>
                {training ? "Training…" : "Run training"}
              </Button>
            </CardBody>
          </Card>
        </section>
      ) : null}

      {trainingResults ? (
        <section id="section-results" className="ntl-section">
          <Card>
            <CardHeader>
              <CardTitle icon={<IconChart />}>Analyze Results</CardTitle>
              <CardDescription>Metrics, charts, and automated fit diagnostics.</CardDescription>
            </CardHeader>
            <CardBody>
              <div className="ntl-results-grid">
                <div className="ntl-subcard">
                  <h4 className="ntl-subcard__title">Model</h4>
                  <p className="ntl-subcard__line">
                    <span className="muted">Type</span>{" "}
                    {MODEL_LABELS[trainingResults.model_type] || trainingResults.model_type}
                  </p>
                  {trainingResults.target_col ? (
                    <p className="ntl-subcard__line">
                      <span className="muted">Target column</span> {trainingResults.target_col}
                    </p>
                  ) : null}
                  {formatHyperparameterRows(trainingResults.model_type, trainingResults.hyperparameters).map((row) => (
                    <p key={row.key} className="ntl-subcard__line">
                      <span className="muted">{row.label}</span> {row.value}
                    </p>
                  ))}
                  <p className="ntl-subcard__line">
                    <span className="muted">Timestamp</span> {new Date(trainingResults.timestamp).toLocaleString()}
                  </p>
                </div>
                <div className="ntl-subcard ntl-subcard--wide">
                  <h4 className="ntl-subcard__title">Performance metrics</h4>
                  <p className="ntl-table-hint">
                    MSE — lower is better · R² — higher is better (max 1.0)
                  </p>
                  <div className="ntl-table-wrap">
                    <table className="ntl-table">
                      <thead>
                        <tr>
                          <th>Dataset</th>
                          <th className="num">MSE</th>
                          <th className="num">R²</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>Training</td>
                          <td className="num mono">{trainingResults.metrics.train_mse.toFixed(2)}</td>
                          <td className="num mono">{trainingResults.metrics.train_r2.toFixed(4)}</td>
                        </tr>
                        <tr className="highlight">
                          <td>Validation</td>
                          <td className="num mono">{trainingResults.metrics.val_mse.toFixed(2)}</td>
                          <td className="num mono">{trainingResults.metrics.val_r2.toFixed(4)}</td>
                        </tr>
                        <tr>
                          <td>Test</td>
                          <td className="num mono">{trainingResults.metrics.test_mse.toFixed(2)}</td>
                          <td className="num mono">{trainingResults.metrics.test_r2.toFixed(4)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              <MetricsChart trainingResults={trainingResults} />
              <div className="ntl-diagnostics">
                <h4 className="ntl-subcard__title">Diagnostics &amp; recommendations</h4>
                {trainingResults.diagnostics.messages.map((msg, idx) => (
                  <DiagnosticRow key={idx} message={msg} />
                ))}
              </div>
              <LearningCurvesPlaceholder />
            </CardBody>
          </Card>
        </section>
      ) : null}
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
