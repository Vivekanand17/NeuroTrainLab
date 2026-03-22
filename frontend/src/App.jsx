import React, { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "./layouts/DashboardLayout";
import { Topbar } from "./components/Topbar";
import DashboardPage from "./pages/DashboardPage";
import API_BASE_URL from "./config";

function App() {
  const [eda, setEda] = useState(null);
  const [trainingResults, setTrainingResults] = useState(null);
  const [modelType, setModelType] = useState("linear");
  const [maxDepth, setMaxDepth] = useState(3);
  const [nEstimators, setNEstimators] = useState(100);
  const [rfMaxDepth, setRfMaxDepth] = useState("");
  const [randomState, setRandomState] = useState(42);
  const [training, setTraining] = useState(false);
  const [cleaning, setCleaning] = useState(false);
  const [cleaned, setCleaned] = useState(false);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [targetCol, setTargetCol] = useState("target");

  const handleUploadSuccess = (edaData) => {
    setEda(edaData);
    setCleaned(false);
    setTrainingResults(null);
  };

  useEffect(() => {
    if (!eda?.columns?.length) return;
    const cols = eda.columns;
    setTargetCol((prev) =>
      cols.includes(prev) ? prev : cols.includes("target") ? "target" : cols[cols.length - 1]
    );
  }, [eda]);

  const handleClean = async () => {
    setCleaning(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/clean?method=mean`);
      alert("✅ Data cleaned successfully!");
      setCleaned(true);
      console.log(response.data);
    } catch (error) {
      console.error("Clean error:", error);
      alert("❌ Cleaning failed - check console");
    } finally {
      setCleaning(false);
    }
  };

  const handleTrain = async () => {
    if (!cleaned) {
      alert("⚠️ Please clean the data first!");
      return;
    }

    setTraining(true);
    try {
      const params = {
        model_type: modelType,
        target_col: targetCol,
        min_samples_leaf: 1,
        random_state: randomState,
        n_estimators: nEstimators,
      };
      if (modelType === "tree") {
        params.max_depth = maxDepth;
      } else if (modelType === "random_forest") {
        if (rfMaxDepth !== "" && rfMaxDepth != null) {
          const d = parseInt(rfMaxDepth, 10);
          if (!Number.isNaN(d)) params.max_depth = d;
        }
      }

      const response = await axios.post(`${API_BASE_URL}/train`, null, { params });

      if (response.data.error) {
        alert("❌ Training failed: " + response.data.error);
      } else {
        setTrainingResults(response.data);
        alert("✅ Training completed!");
      }
    } catch (error) {
      console.error("Training error:", error);
      alert("❌ Training failed - check console");
    }
    setTraining(false);
  };

  const topbarStatus = training || cleaning || uploadBusy ? "busy" : trainingResults ? "success" : "idle";
  let topbarLabel;
  if (training) topbarLabel = "Training model";
  else if (cleaning) topbarLabel = "Cleaning dataset";
  else if (uploadBusy) topbarLabel = "Uploading file";

  return (
    <DashboardLayout topbar={<Topbar status={topbarStatus} statusLabel={topbarLabel} />}>
      <DashboardPage
        eda={eda}
        trainingResults={trainingResults}
        modelType={modelType}
        setModelType={setModelType}
        maxDepth={maxDepth}
        setMaxDepth={setMaxDepth}
        nEstimators={nEstimators}
        setNEstimators={setNEstimators}
        rfMaxDepth={rfMaxDepth}
        setRfMaxDepth={setRfMaxDepth}
        randomState={randomState}
        setRandomState={setRandomState}
        training={training}
        cleaning={cleaning}
        cleaned={cleaned}
        onUploadSuccess={handleUploadSuccess}
        onUploadLoadingChange={setUploadBusy}
        handleClean={handleClean}
        handleTrain={handleTrain}
        targetCol={targetCol}
        setTargetCol={setTargetCol}
        apiBaseUrl={API_BASE_URL}
      />
    </DashboardLayout>
  );
}

export default App;
