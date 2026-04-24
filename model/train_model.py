"""Train a Logistic Regression sentiment classifier with TF-IDF features."""
import sys
from pathlib import Path

import joblib
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.model_selection import train_test_split

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "backend"))
from preprocess import preprocess_text  # noqa: E402

DATA_PATH = ROOT / "sample_data" / "sentiment_dataset.csv"
MODEL_OUT = ROOT / "model" / "sentiment_model.pkl"
VEC_OUT = ROOT / "model" / "tfidf_vectorizer.pkl"


def main():
    print(f"📥 Loading dataset: {DATA_PATH}")
    df = pd.read_csv(DATA_PATH)
    df = df.dropna(subset=["text", "label"])
    print(f"   rows={len(df)}  classes={sorted(df['label'].unique())}")

    print("🧹 Preprocessing text...")
    df["clean"] = df["text"].astype(str).apply(preprocess_text)
    df = df[df["clean"].str.len() > 0]

    X_train, X_test, y_train, y_test = train_test_split(
        df["clean"], df["label"], test_size=0.2, random_state=42, stratify=df["label"]
    )

    print("🔢 Fitting TF-IDF vectorizer...")
    vectorizer = TfidfVectorizer(ngram_range=(1, 2), min_df=1, max_df=0.95)
    Xtr = vectorizer.fit_transform(X_train)
    Xte = vectorizer.transform(X_test)

    print("🤖 Training Logistic Regression...")
    model = LogisticRegression(max_iter=1000, class_weight="balanced")
    model.fit(Xtr, y_train)

    preds = model.predict(Xte)
    print(f"\n✅ Accuracy: {accuracy_score(y_test, preds):.3f}")
    print(classification_report(y_test, preds, zero_division=0))

    joblib.dump(model, MODEL_OUT)
    joblib.dump(vectorizer, VEC_OUT)
    print(f"💾 Saved model       → {MODEL_OUT}")
    print(f"💾 Saved vectorizer  → {VEC_OUT}")


if __name__ == "__main__":
    main()
