"""Flask REST API for the Sentiment Analysis System."""
import os
from pathlib import Path
import joblib
from flask import Flask, request, jsonify
from flask_cors import CORS

from preprocess import preprocess_text
from database import init_db, save_analysis, get_all, search, delete_one, delete_all

BASE = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE / "model" / "sentiment_model.pkl"
VEC_PATH = BASE / "model" / "tfidf_vectorizer.pkl"

app = Flask(__name__)
CORS(app)
init_db()

# Lazy load model
_model = None
_vectorizer = None


def load_artifacts():
    global _model, _vectorizer
    if _model is None or _vectorizer is None:
        if not MODEL_PATH.exists() or not VEC_PATH.exists():
            raise FileNotFoundError(
                "Model artifacts not found. Run `python model/train_model.py` first."
            )
        _model = joblib.load(MODEL_PATH)
        _vectorizer = joblib.load(VEC_PATH)
    return _model, _vectorizer


@app.get("/")
def root():
    return jsonify({"status": "ok", "service": "Sentiment Analysis API"})


@app.post("/predict")
def predict():
    data = request.get_json(silent=True) or {}
    text = (data.get("text") or "").strip()
    if not text:
        return jsonify({"error": "Field 'text' is required."}), 400

    model, vec = load_artifacts()
    processed = preprocess_text(text)
    if not processed:
        processed = text.lower()

    X = vec.transform([processed])
    proba = model.predict_proba(X)[0]
    classes = list(model.classes_)
    label = classes[proba.argmax()]
    confidence = float(proba.max())
    probabilities = {cls: float(p) for cls, p in zip(classes, proba)}

    item_id = save_analysis(text, processed, label, confidence)

    return jsonify({
        "id": item_id,
        "sentiment": label,
        "confidence": round(confidence, 4),
        "processed_text": processed,
        "probabilities": probabilities,
    })


@app.get("/history")
def history():
    return jsonify(get_all())


@app.get("/search")
def search_route():
    q = request.args.get("q", "").strip()
    if not q:
        return jsonify(get_all())
    return jsonify(search(q))


@app.delete("/history/<int:item_id>")
def delete_item(item_id):
    delete_one(item_id)
    return jsonify({"deleted": item_id})


@app.delete("/history")
def clear_history():
    delete_all()
    return jsonify({"cleared": True})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
