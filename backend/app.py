import logging
import os
from contextlib import asynccontextmanager
from typing import Optional

import pandas as pd
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from paths import CLEANED_CSV, DATA_DIR, RAW_CSV
from train import train_model
from utils import get_eda_summary, handle_missing_values

# ---------------- LOGGING ---------------- #
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("neurotrain")

# ---------------- MODEL CACHE ---------------- #
trained_model = None
model_params = None


# ---------------- LIFESPAN ---------------- #
@asynccontextmanager
async def lifespan(app: FastAPI):
    os.makedirs(DATA_DIR, exist_ok=True)
    logger.info("NeuroTrain Lab API starting | DATA_DIR=%s", DATA_DIR)
    yield
    logger.info("NeuroTrain Lab API shutdown")


app = FastAPI(title="NeuroTrain Lab API", lifespan=lifespan)

# ---------------- CORS ---------------- #
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ✅ allow frontend (Vercel)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- ROOT ---------------- #
@app.get("/")
def read_root():
    return {"status": "API running", "service": "NeuroTrain Lab"}


@app.get("/health")
def health():
    return {"status": "ok"}


# ---------------- UPLOAD ---------------- #
@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        contents = await file.read()
        os.makedirs(DATA_DIR, exist_ok=True)

        logger.info("Upload received: %s (%s bytes)", file.filename, len(contents))

        with open(RAW_CSV, "wb") as f:
            f.write(contents)

        df = pd.read_csv(RAW_CSV)

        eda = {
            "shape": list(df.shape),
            "columns": df.columns.tolist(),
            "dtypes": df.dtypes.astype(str).to_dict(),
            "missing_count": df.isnull().sum().to_dict(),
            "first_5_rows": df.head().to_dict("records"),
        }

        return eda

    except Exception as e:
        logger.exception("Upload failed")
        return {"error": f"Upload failed: {str(e)}"}


# ---------------- CLEAN ---------------- #
@app.post("/clean")
async def clean_data(method: str = "mean"):
    try:
        logger.info("Clean request: method=%s", method)

        df = pd.read_csv(RAW_CSV)
        df_clean = handle_missing_values(df, method=method)

        df_clean.to_csv(CLEANED_CSV, index=False)

        return {
            "message": "Data cleaned successfully",
            "cleaned_shape": list(df_clean.shape),
            "eda": get_eda_summary(df_clean),
        }

    except Exception as e:
        logger.exception("Clean failed")
        return {"error": f"Data cleaning failed: {str(e)}"}


# ---------------- TRAIN ---------------- #
@app.post("/train")
async def train_endpoint(
    model_type: str = "linear",
    target_col: str = "target",
    max_depth: Optional[int] = None,
    min_samples_leaf: int = 1,
    n_estimators: int = 100,
    random_state: int = 42,
):
    global trained_model, model_params

    current_params = {
        "model_type": model_type,
        "target_col": target_col,
        "max_depth": max_depth,
        "min_samples_leaf": min_samples_leaf,
        "n_estimators": n_estimators,
        "random_state": random_state,
    }

    try:
        # ✅ Train only if params changed (cache optimization)
        if trained_model is None or model_params != current_params:
            logger.info("Training started | model=%s target=%s", model_type, target_col)

            results = train_model(
                model_type=model_type,
                target_col=target_col,
                max_depth=max_depth,
                min_samples_leaf=min_samples_leaf,
                n_estimators=n_estimators,
                random_state=random_state,
            )

            trained_model = results
            model_params = current_params

        else:
            logger.info("Using cached model result")
            results = trained_model

        return results

    except Exception as e:
        logger.exception("Training failed")
        return {
            "error": str(e),
            "message": "Training failed. Check cleaned data & target column.",
        }