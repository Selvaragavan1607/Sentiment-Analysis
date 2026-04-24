import React, { useState } from "react";
export default function SentimentForm({ onAnalyze, loading }) {
  const [text, setText] = useState("");
  const submit = (e) => {
    e.preventDefault();
    if (text.trim()) onAnalyze(text.trim());
  };
  return (
    <form className="card" onSubmit={submit}>
      <h2 style={{ margin: "0 0 12px" }}>Analyze a Post</h2>
      <textarea
        placeholder="Paste a tweet, comment, or review..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="row">
        <button className="btn" type="submit" disabled={loading || !text.trim()}>
          {loading ? <><span className="spinner" /> Analyzing...</> : "🔍 Analyze Sentiment"}
        </button>
        <button type="button" className="btn btn-ghost" onClick={() => setText("")}>
          Clear
        </button>
      </div>
    </form>
  );
}
