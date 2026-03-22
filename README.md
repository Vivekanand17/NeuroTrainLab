## NEUROTRAINLAB
## Overview

This is a web-based application designed to train machine learning models and automatically identify issues such as overfitting and underfitting using performance metrics and diagnostic logic.

Technology Stack

Backend: FastAPI
Machine Learning Libraries: scikit-learn, pandas, numpy
Frontend: React

Setup Instructions

Backend Setup
cd backend
pip install -r requirements.txt
uvicorn app:app --reload --host 0.0.0.0 --port 8000

Frontend Setup
cd frontend
npm install
npm run start

Access the application at: http://localhost:3000

Data Handling

Upload dataset to /data/raw.csv
Processed dataset will be saved at /data/cleaned.csv
Example dataset: Salary prediction using experience, age, and education to predict salary
Core Functionalities

Data Upload and Exploration
Upload CSV files and automatically generate summary statistics.

Data Preprocessing
Handle missing values using mean, median, or mode imputation.

Model Training

Train models such as Linear Regression and Decision Tree with configurable parameters.
Model Diagnostics
Evaluate model performance and detect overfitting or underfitting automatically.
Experiment Logging
Store training results, metrics, and configurations in structured JSON format.


How to Use

Upload a CSV dataset
Perform data cleaning
Select a model and configure hyperparameters
Train the model
Review evaluation metrics such as MSE and R² along with diagnostic feedback


Weekly Learning Breakdown

Week 1: Writing modular Python code using functions, files, and structured organization
Week 2: Data preprocessing and handling missing values using pandas
Week 3: Understanding Mean Squared Error and basic optimization concepts
Week 4: Learning bias-variance tradeoff and identifying overfitting and underfitting
Week 5: Performing hyperparameter tuning such as adjusting decision tree depth
Week 6: Analyzing training performance using evaluation metrics and diagnostics

## Project Structure
```
ml-diagnostics-dashboard/
├── backend/
│   ├── app.py              # FastAPI endpoints
│   ├── utils.py            # Data cleaning
│   ├── train.py            # Model training & diagnostics
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   └── components/UploadForm.jsx
│   └── package.json
├── data/
│   ├── raw.csv
│   └── cleaned.csv
├── logs/
│   └── training_*.json
├── README.md
└── training_analysis.md
```

Key Learnings

Integrated diagnostics: Using both MSE and R² metrics together allows reliable detection of overfitting and underfitting.
Importance of data quality: Proper cleaning and validation of datasets is essential before training any model.

Tradeoff in model complexity: Highly complex models such as deep decision trees may overfit; simpler models often perform better on small datasets.
Reproducibility: Consistent results are achieved by using fixed random seeds and detailed logging of experiments.

Notes on Loss Curves

Loss curves, which plot error over training epochs, are primarily useful for iterative training algorithms like Neural Networks.
Since this system uses Linear Regression and Decision Trees, which complete training in a single pass, we present final metrics (train, validation, and test MSE and R²). These metrics are sufficient to evaluate overfitting or underfitting without the need for epoch-by-epoch visualization.

Troubleshooting

Cross-Origin Resource Sharing (CORS) issues: Make sure the backend allows requests from all origins by setting allow_origins=["*"].

Port conflicts: If React detects an occupied port, confirm the prompt to use an alternative port.
Training errors: Ensure the CSV contains a target column and that all data has been cleaned.


Visualization Approach

Metrics presentation: Train, validation, and test metrics are displayed in tables for clear comparison.
Rationale for skipping epoch-based loss plots: Since the models train in a single step, plotting a loss curve over epochs is not meaningful. Instead, final metrics demonstrate both bias-variance behavior and overfitting/underfitting clearly.
Future enhancements: Consider including learning curves (performance versus dataset size) for more detailed model analysis in upcoming versions.

Author

Developed for the CreativeARC Services Pvt Ltd ML Internship Program.