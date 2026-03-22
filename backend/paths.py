"""
Project paths resolved relative to this file (no drive letters or cwd assumptions).
Suitable for Render: repo layout is backend/ adjacent to data/ and logs/.
"""
import os

BACKEND_ROOT = os.path.dirname(os.path.abspath(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(BACKEND_ROOT, ".."))

DATA_DIR = os.path.join(PROJECT_ROOT, "data")
LOGS_DIR = os.path.join(PROJECT_ROOT, "logs")

RAW_CSV = os.path.join(DATA_DIR, "raw.csv")
CLEANED_CSV = os.path.join(DATA_DIR, "cleaned.csv")
