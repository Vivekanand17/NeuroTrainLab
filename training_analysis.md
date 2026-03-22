🧾 ML Experiment Log – Salary Prediction System
📊 1. Data Snapshot

• Total Records: 93
• Features: experience, age, education
• Target Variable: salary (USD)

✅ Dataset Quality: No missing or inconsistent values detected
📌 Conclusion: Data is clean and ready for modeling without heavy preprocessing

⚙️ 2. Data Handling Strategy

• Applied Pipeline: Default preprocessing (mean imputation fallback)
• Generated File: /data/cleaned.csv

ℹ️ Note: Even though no missing values exist, the pipeline ensures robustness for future datasets

🤖 3. Model Experiments
🔹 A. Linear Regression

⚙️ Configuration
• Algorithm: Linear Regression
• Split Ratio: 60 / 16 / 24
• Random State: 42

📈 Results
• Train → MSE: 0.91M | R²: 0.998
• Validation → MSE: 2.11M | R²: 0.995
• Test → MSE: 1.45M | R²: 0.997

🔍 Gap Analysis
• Train → Validation MSE ↑ +1.20M
• Validation → Test MSE ↓ -0.66M
• R² Drop (Train → Val): 0.003

🧠 Insight
✅ Extremely stable model with minimal variance
📌 Captures underlying linear relationship efficiently

🔹 B. Decision Tree (Low Depth)

⚙️ Configuration
• Max Depth: 3
• Random State: 42

📈 Results
• Train → MSE: 9.7M | R²: 0.982
• Validation → MSE: 15.8M | R²: 0.963
• Test → MSE: 12.7M | R²: 0.978

🔍 Gap Analysis
• Train → Validation MSE ↑ +6.1M
• Validation → Test MSE ↓ -3.1M
• R² Drop: 0.019

🧠 Insight
✅ Good generalization but lower accuracy
📌 Simplicity prevents overfitting but misses finer patterns

🔹 C. Decision Tree (High Depth)

⚙️ Configuration
• Max Depth: 15
• Random State: 42

📈 Results
• Train → MSE: 0.06M | R²: 0.9999
• Validation → MSE: 5.2M | R²: 0.988
• Test → MSE: 4.7M | R²: 0.992

🔍 Gap Analysis
• Train → Validation MSE ↑ +5.14M ⚠️
• Overfit Ratio: ~86× increase
• R² Drop: 0.012

🧠 Insight
⚠️ Severe overfitting detected
📌 Model memorizes training data instead of learning patterns

🔹 D. Random Forest Regressor

⚙️ Configuration
• Number of Trees: 100
• Max Depth: Auto
• Random State: 42

📈 Results
• Train → MSE: 0.15M | R²: 0.9996
• Validation → MSE: 1.75M | R²: 0.996
• Test → MSE: 1.62M | R²: 0.9965

🔍 Gap Analysis
• Train → Validation MSE ↑ +1.60M
• Validation → Test MSE ↓ -0.13M
• R² Drop: 0.0036

🧠 Insight
✅ Strong balance between accuracy & generalization
📌 Ensemble averaging reduces variance seen in single trees

📊 4. Model Comparison (With Differences)
Model	Train MSE   	Val MSE	    Test MSE	Val Gap	    Overfit     Level
Linear Regression	    0.91M	    2.11M	    1.45M	    +1.20M	    Low ✅
Decision Tree (3)	    9.7M	    15.8M	    12.7M	    +6.1M	    Low ✅
Decision Tree (15)	    0.06M	    5.2M	    4.7M	    +5.14M	    High ⚠️
Random Forest	        0.15M	    1.75M	    1.62M	    +1.60M	    Low ✅
🏆 5. Performance Interpretation

• Best Accuracy: Linear Regression
• Best Stability: Random Forest
• Worst Generalization: Deep Decision Tree
• Best Tree-Based Option: Random Forest

🧠 6. Key Learnings

📌 Increasing complexity ≠ better performance
📌 Ensemble models reduce instability
📌 Small datasets favor simpler models
📌 MSE gap is a stronger overfitting indicator than R²

🏁 7. Final Recommendation

🏆 Selected Model: Linear Regression

✔ Why?
• Lowest test error
• Minimal variance across splits
• Fast and interpretable
• No overfitting observed

🔁 Backup Option: Random Forest (for future complex data)

⚙️ 8. System Capability Review

✅ Automated preprocessing pipeline
✅ Multi-model training support
✅ Overfitting detection using gap analysis
✅ Experiment logging system

📁 Logs stored at: /logs/training_*.json

📌 9. Final Summary

• Simple models can outperform complex ones in structured datasets
• Monitoring both error (MSE) and fit (R²) is critical
• Controlled experiments ensure reproducibility

🚀 Final Insight

🧠 The system not only trains models but also thinks like a data scientist by:

Comparing performance gaps
Detecting instability
Recommending optimal models