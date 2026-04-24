# Social Media Sentiment Analysis System

A full-stack Machine Learning web application that analyzes social media text (tweets, comments, reviews) and classifies sentiment as **Positive**, **Negative**, or **Neutral**.

Built for a **Machine Learning Techniques Lab Record**.

---

## 🧠 Features

- 🎯 Sentiment prediction (Positive / Negative / Neutral)
- 📊 Confidence score + probability bar chart
- 🕘 Sentiment history table (stored in SQLite)
- 🔍 Search previous analyses
- 🗑️ Delete history entries
- 🌙 Dark / Light theme toggle
- 📄 Download analysis report as PDF
- ⚡ Loading animation during prediction
- 🧪 NLP preprocessing: lowercase, punctuation removal, stopword removal, tokenization
- 🔢 TF-IDF vectorization
- 🤖 Logistic Regression model (scikit-learn)
- 🌐 REST API (Flask) with `/predict`, `/history`, `/history/<id>`, `/search`

---

## 📁 Folder Structure

```
sentiment-analysis-system/
├── backend/
│   ├── app.py                # Flask REST API
│   ├── preprocess.py         # NLP preprocessing
│   ├── database.py           # SQLite setup
│   └── sentiment.db          # (auto-created)
├── model/
│   ├── train_model.py        # Train Logistic Regression
│   ├── sentiment_model.pkl   # (generated after training)
│   └── tfidf_vectorizer.pkl  # (generated after training)
├── sample_data/
│   └── sentiment_dataset.csv
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── index.css
│       └── components/
│           ├── SentimentForm.jsx
│           ├── ResultCard.jsx
│           ├── ProbabilityChart.jsx
│           ├── HistoryTable.jsx
│           └── ThemeToggle.jsx
├── requirements.txt
├── .env.example
└── README.md
```

---

## ⚙️ Installation

### 1. Clone
```bash
git clone <your-repo-url>
cd sentiment-analysis-system
```

### 2. Backend Setup (Python)
```bash
cd backend
python -m venv venv
source venv/bin/activate    # Windows: venv\Scripts\activate
pip install -r ../requirements.txt
```

### 3. Train the ML Model
```bash
cd ../model
python train_model.py
```
This creates `sentiment_model.pkl` and `tfidf_vectorizer.pkl`.

### 4. Run Backend
```bash
cd ../backend
python app.py
```
Backend runs on `http://localhost:5000`.

### 5. Frontend Setup (React + Vite)
```bash
cd ../frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/predict` | Predict sentiment (body: `{ "text": "..." }`) |
| GET | `/history` | Get all past analyses |
| GET | `/search?q=keyword` | Search history |
| DELETE | `/history/<id>` | Delete one entry |
| DELETE | `/history` | Clear all history |

### Example
```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"I absolutely love this product!"}'
```
Response:
```json
{
  "sentiment": "Positive",
  "confidence": 0.93,
  "processed_text": "absolutely love product",
  "probabilities": { "Positive": 0.93, "Neutral": 0.05, "Negative": 0.02 }
}
```

---

## 🚀 Deployment

### Backend (Render / Railway)
- New Web Service → connect GitHub repo
- Build command: `pip install -r requirements.txt && python model/train_model.py`
- Start command: `cd backend && gunicorn app:app`
- Add environment variable from `.env.example`

### Frontend (Vercel)
- Import GitHub repo → Root: `frontend/`
- Build command: `npm run build`
- Output directory: `dist`
- Set env var: `VITE_API_URL=https://your-backend.onrender.com`

---

## 🧪 Machine Learning Workflow

1. **Dataset** → labeled social media text (Positive / Negative / Neutral)
2. **Preprocessing** → lowercase → remove punctuation/URLs → tokenize → remove stopwords
3. **Feature Extraction** → TF-IDF vectorization (uni + bigrams)
4. **Model** → Logistic Regression (scikit-learn)
5. **Evaluation** → accuracy + classification report
6. **Serialization** → joblib `.pkl` files
7. **Inference** → Flask `/predict` endpoint returns label + probabilities

---

## 📊 Sample Dataset
See `sample_data/sentiment_dataset.csv`. Replace with a larger dataset (e.g. Sentiment140, Twitter US Airline Sentiment) for production accuracy.

---
