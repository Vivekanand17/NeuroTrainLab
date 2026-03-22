import React, { useState } from "react";
import axios from "axios";
import { Button } from "./ui/Button";
import BASE_URL from "../config";

function UploadForm({ onUploadSuccess, onLoadingChange }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const setBusy = (v) => {
    setLoading(v);
    onLoadingChange?.(v);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setBusy(true);

    try {
      const response = await axios.post(`${BASE_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response && response.data) {
        onUploadSuccess?.(response.data);
      }

      alert("✅ File uploaded successfully!");
    } catch (error) {
      console.error("Upload failed:", error);

      if (error.response) {
        alert(`❌ Upload failed: ${error.response.data?.detail || "Server error"}`);
      } else if (error.request) {
        alert("❌ No response from server. Check backend connection.");
      } else {
        alert("❌ Upload error occurred.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="ntl-upload">
      <div className="ntl-upload__row">
        <input
          className="ntl-file"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
        />
        <Button onClick={handleUpload} disabled={loading} loading={loading}>
          {loading ? "Uploading…" : "Upload CSV"}
        </Button>
      </div>
    </div>
  );
}

export default UploadForm;