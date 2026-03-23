import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

bank = pd.read_csv("bank.csv", sep=";")

X = bank.drop("y", axis=1)
y = bank["y"]

label_encoders = {}
for col in X.select_dtypes(include=["object"]).columns:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

model = RandomForestClassifier(class_weight="balanced")
model.fit(X_train, y_train)

joblib.dump(model, "deposit_model.pkl")
joblib.dump(label_encoders, "deposit_encoders.pkl")
