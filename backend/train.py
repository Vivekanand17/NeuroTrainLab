import json
import os
from datetime import datetime

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeRegressor

# Base directory for absolute paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))


def create_estimator(
    model_type,
    *,
    max_depth=None,
    min_samples_leaf=1,
    random_state=42,
    n_estimators=100,
):
    """
    Factory for sklearn regressors. Keeps training extensible for new model types.
    """
    if model_type == "linear":
        return LinearRegression(), {"max_depth": None, "min_samples_leaf": None, "n_estimators": None, "random_state": None}

    if model_type == "tree":
        tree_depth = max_depth if max_depth is not None else 3
        model = DecisionTreeRegressor(
            max_depth=tree_depth,
            min_samples_leaf=min_samples_leaf,
            random_state=random_state,
        )
        hp = {
            "max_depth": tree_depth,
            "min_samples_leaf": min_samples_leaf,
            "n_estimators": None,
            "random_state": random_state,
        }
        return model, hp

    if model_type == "random_forest":
        model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=max_depth,
            min_samples_leaf=min_samples_leaf,
            random_state=random_state,
            n_jobs=-1,
        )
        hp = {
            "max_depth": max_depth,
            "min_samples_leaf": min_samples_leaf,
            "n_estimators": n_estimators,
            "random_state": random_state,
        }
        return model, hp

    raise ValueError(f"Unknown model type: {model_type}")


def _feature_importance_chart_data(model, feature_names):
    """Bar-chart payload for tree-based models; None if unavailable."""
    if not hasattr(model, "feature_importances_"):
        return None
    importances = np.asarray(model.feature_importances_, dtype=float)
    names = list(feature_names)
    if len(names) != len(importances):
        return None
    pairs = sorted(zip(names, importances), key=lambda x: x[1], reverse=True)
    return [{"feature": str(n), "importance": float(v)} for n, v in pairs]


def train_model(
    model_type="linear",
    target_col="target",
    test_size=0.2,
    random_state=42,
    max_depth=None,
    min_samples_leaf=1,
    n_estimators=100,
):
    """
    Train a model and return metrics + diagnostics (+ optional feature importance for tree / RF).
    """
    data_path = os.path.join(BASE_DIR, "../data/cleaned.csv")
    df = pd.read_csv(data_path)

    X = df.drop(columns=[target_col])
    y = df[target_col]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    X_train, X_val, y_train, y_val = train_test_split(
        X_train, y_train, test_size=0.2, random_state=random_state
    )

    model, hyperparameters = create_estimator(
        model_type,
        max_depth=max_depth,
        min_samples_leaf=min_samples_leaf,
        random_state=random_state,
        n_estimators=n_estimators,
    )

    model.fit(X_train, y_train)

    y_train_pred = model.predict(X_train)
    y_val_pred = model.predict(X_val)
    y_test_pred = model.predict(X_test)

    train_mse = mean_squared_error(y_train, y_train_pred)
    val_mse = mean_squared_error(y_val, y_val_pred)
    test_mse = mean_squared_error(y_test, y_test_pred)

    train_r2 = r2_score(y_train, y_train_pred)
    val_r2 = r2_score(y_val, y_val_pred)
    test_r2 = r2_score(y_test, y_test_pred)

    diagnostics = detect_issues(train_mse, val_mse, test_mse, train_r2, val_r2, test_r2)

    chart_data = {
        "metrics": [
            {"name": "Train", "MSE": float(train_mse), "R2": float(train_r2)},
            {"name": "Validation", "MSE": float(val_mse), "R2": float(val_r2)},
            {"name": "Test", "MSE": float(test_mse), "R2": float(test_r2)},
        ]
    }

    fi = _feature_importance_chart_data(model, X.columns)
    if fi is not None:
        chart_data["feature_importance"] = fi

    log_data = {
        "timestamp": datetime.now().isoformat(),
        "model_type": model_type,
        "hyperparameters": hyperparameters,
        "metrics": {
            "train_mse": float(train_mse),
            "val_mse": float(val_mse),
            "test_mse": float(test_mse),
            "train_r2": float(train_r2),
            "val_r2": float(val_r2),
            "test_r2": float(test_r2),
        },
        "diagnostics": diagnostics,
        "chart_data": chart_data,
    }

    log_dir = os.path.join(BASE_DIR, "../logs")
    os.makedirs(log_dir, exist_ok=True)

    log_filename = os.path.join(log_dir, f"training_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json")
    with open(log_filename, "w") as f:
        json.dump(log_data, f, indent=2)

    return log_data


def detect_issues(train_mse, val_mse, test_mse, train_r2, val_r2, test_r2):
    """Detect overfitting, underfitting, etc. — generic across model families."""
    diagnostics = {
        "overfitting": False,
        "underfitting": False,
        "good_fit": False,
        "unstable": False,
        "messages": [],
    }

    if np.isnan(train_mse) or np.isnan(val_mse) or np.isnan(test_mse):
        diagnostics["unstable"] = True
        diagnostics["messages"].append(
            "❌ NaN detected in loss! Check your data preprocessing and model settings."
        )
        return diagnostics

    avg_r2 = (train_r2 + val_r2 + test_r2) / 3
    r2_variance = max(train_r2, val_r2, test_r2) - min(train_r2, val_r2, test_r2)

    mse_ratio = val_mse / train_mse if train_mse > 0 else 1
    r2_drop = train_r2 - val_r2

    if mse_ratio > 10.0 or (mse_ratio > 3.0 and r2_drop > 0.05):
        diagnostics["overfitting"] = True
        diagnostics["messages"].append(
            "⚠️ SEVERE Overfitting detected: Model memorizes training data but fails on new data. "
            f"Training MSE is {train_mse:.0f} but Validation MSE is {val_mse:.0f} ({mse_ratio:.1f}x higher). "
            "Try: reduce complexity (lower max_depth, fewer trees / shallower forest), "
            "add regularization, or collect more data."
        )

    elif mse_ratio > 3.0 and r2_drop > 0.02:
        diagnostics["overfitting"] = True
        diagnostics["messages"].append(
            "⚠️ Moderate Overfitting: Validation performance is noticeably worse than training. "
            f"MSE ratio: {mse_ratio:.2f}x, R² drop: {r2_drop:.3f}. "
            "Consider: slightly reducing model complexity or adding more training data."
        )

    elif avg_r2 < 0.7:
        diagnostics["underfitting"] = True
        diagnostics["messages"].append(
            "⚠️ Underfitting detected: Model is too simple to capture patterns. "
            f"Average R² score is only {avg_r2:.3f} (should be >0.8 for good fit). "
            "Try: increase model complexity, add more features, or use polynomial features."
        )

    else:
        diagnostics["good_fit"] = True
        diagnostics["messages"].append(
            f"✅ Model appears to be well-fitted! "
            f"Average R² = {avg_r2:.4f}, R² variance = {r2_variance:.4f}. "
            "Performance is consistent across train/validation/test sets."
        )

    if r2_variance > 0.1 and not diagnostics["overfitting"]:
        diagnostics["messages"].append(
            f"ℹ️ Note: R² scores vary by {r2_variance:.3f} across datasets. "
            "This might indicate: (1) small dataset size, (2) data distribution differences, or (3) random variation."
        )

    test_val_diff = abs(test_mse - val_mse) / val_mse if val_mse > 0 else 0
    if test_val_diff > 0.5 and not diagnostics["overfitting"]:
        diagnostics["messages"].append(
            f"ℹ️ Test and validation losses differ by {test_val_diff*100:.1f}%. "
            "This is normal for small datasets but monitor if using for production."
        )

    return diagnostics
