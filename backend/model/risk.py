import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

default_data = pd.read_excel("default of credit card clients.xls", header=1)

default_data = default_data.drop("ID", axis=1)

X2 = default_data.drop("default payment next month", axis=1)
y2 = default_data["default payment next month"]

label_encoders = {}
for col in X2.select_dtypes(include=["object"]).columns:
    le = LabelEncoder()
    X2[col] = le.fit_transform(X2[col])
    label_encoders[col] = le

X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2, random_state=42)

model_risk = RandomForestClassifier(class_weight="balanced")
model_risk.fit(X2_train, y2_train)

joblib.dump(model_risk, "risk_model.pkl")
joblib.dump(label_encoders, "risk_encoders.pkl")
print(X2.columns.tolist())