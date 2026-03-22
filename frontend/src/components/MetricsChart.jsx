import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./MetricsChart.css";

const axisStyle = { fill: "#94a3b8", fontSize: 11 };
const gridColor = "rgba(148, 163, 184, 0.12)";

function MetricsChart({ trainingResults }) {
  if (!trainingResults || !trainingResults.chart_data || !trainingResults.chart_data.metrics) {
    return null;
  }

  const data = trainingResults.chart_data.metrics;
  const fiRaw = trainingResults.chart_data.feature_importance;
  const fiData = Array.isArray(fiRaw)
    ? fiRaw.map((row) => ({
        feature: row.feature,
        importance: row.importance,
      }))
    : [];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="ntl-chart-tooltip">
          <p className="ntl-chart-tooltip__title">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="ntl-chart-tooltip__row" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === "number" ? entry.value.toFixed(2) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const FiTooltip = ({ active, payload }) => {
    if (active && payload && payload.length > 0) {
      const row = payload[0].payload;
      return (
        <div className="ntl-chart-tooltip">
          <p className="ntl-chart-tooltip__title">{row.feature}</p>
          <p className="ntl-chart-tooltip__row" style={{ color: "#a78bfa" }}>
            Importance: {typeof row.importance === "number" ? row.importance.toFixed(4) : row.importance}
          </p>
        </div>
      );
    }
    return null;
  };

  const fiHeight = Math.min(520, 48 + fiData.length * 36);

  return (
    <div className="ntl-chart-card">
      <h4 className="ntl-chart-card__title">Performance visualization</h4>

      <div className="ntl-chart-block">
        <h5 className="ntl-chart-block__subtitle">Mean Squared Error (lower is better)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="ntlMseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#c2410c" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
            <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.08)" }} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
            <Bar dataKey="MSE" name="MSE" fill="url(#ntlMseGrad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="ntl-chart-block">
        <h5 className="ntl-chart-block__subtitle">R² score (higher is better, max 1.0)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data} margin={{ top: 16, right: 16, left: 4, bottom: 4 }}>
            <defs>
              <linearGradient id="ntlR2Grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#059669" />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
            <XAxis dataKey="name" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
            <YAxis domain={[0, 1]} tick={axisStyle} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(34, 211, 238, 0.08)" }} />
            <Legend wrapperStyle={{ color: "#94a3b8", fontSize: 12 }} />
            <Bar dataKey="R2" name="R²" fill="url(#ntlR2Grad)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {fiData.length > 0 ? (
        <div className="ntl-chart-block ntl-chart-block--importance">
          <h5 className="ntl-chart-block__subtitle">Feature importance (tree-based model)</h5>
          <ResponsiveContainer width="100%" height={fiHeight}>
            <BarChart
              layout="vertical"
              data={fiData}
              margin={{ top: 8, right: 20, left: 8, bottom: 8 }}
            >
              <defs>
                <linearGradient id="ntlFiGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#22d3ee" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} horizontal />
              <XAxis type="number" tick={axisStyle} axisLine={{ stroke: gridColor }} tickLine={false} />
              <YAxis
                type="category"
                dataKey="feature"
                width={140}
                tick={{ ...axisStyle, fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip content={<FiTooltip />} cursor={{ fill: "rgba(139, 92, 246, 0.06)" }} />
              <Bar dataKey="importance" name="Importance" fill="url(#ntlFiGrad)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : null}

      <p className="ntl-chart-note">
        Linear models, decision trees, and random forests report final hold-out metrics here (not epoch-wise loss).
        Use the gaps between train, validation, and test to spot overfitting; feature importance applies to
        tree-based estimators.
      </p>
    </div>
  );
}

export default MetricsChart;
