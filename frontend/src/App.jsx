import React, { useEffect, useState } from "react";
import { api } from "./lib/api.js";
import SentimentForm from "./components/SentimentForm.jsx";
import ResultCard from "./components/ResultCard.jsx";
import HistoryTable from "./components/HistoryTable.jsx";
import ThemeToggle from "./components/ThemeToggle.jsx";

export default function App() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const loadHistory = async () => {
    try { const r = await api.get("/history"); setHistory(r.data); } catch {}
  };
  useEffect(() => { loadHistory(); }, []);

  const analyze = async (text) => {
    setLoading(true); setError(""); setResult(null);
    try {
      const r = await api.post("/predict", { text });
      setResult({ ...r.data, original: text });
      loadHistory();
    } catch (e) {
      setError(e.response?.data?.error || "Failed to reach API. Is the backend running?");
    } finally { setLoading(false); }
  };

  const search = async (q) => {
    try {
      const r = await api.get("/search", { params: { q } });
      setHistory(r.data);
    } catch {}
  };

  const del = async (id) => { await api.delete(`/history/${id}`); loadHistory(); };
  const clearAll = async () => {
    if (!confirm("Delete all history?")) return;
    await api.delete("/history"); loadHistory();
  };

  return (
    <div className="app">
      <div className="header">
        <div>
          <h1>💬 Sentiment Analysis </h1>
        </div>
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>

      <SentimentForm onAnalyze={analyze} loading={loading} />
      {error && <div className="card" style={{ borderColor: "var(--negative)", color: "var(--negative)" }}>{error}</div>}
      {result && <ResultCard result={result} />}
      <HistoryTable history={history} onSearch={search} onDelete={del} onClear={clearAll} />
    </div>
  );
}
