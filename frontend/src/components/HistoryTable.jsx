import React, { useState } from "react";

export default function HistoryTable({ history, onSearch, onDelete, onClear }) {
  const [q, setQ] = useState("");
  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>📚 History</h2>
        <button className="btn btn-danger" onClick={onClear} disabled={!history.length}>
          Clear All
        </button>
      </div>
      <div className="row" style={{ marginTop: 0, marginBottom: 12 }}>
        <input
          className="search"
          placeholder="Search by text or sentiment..."
          value={q}
          onChange={(e) => { setQ(e.target.value); onSearch(e.target.value); }}
        />
      </div>
      {history.length === 0 ? (
        <div className="empty">No analyses yet. Try analyzing a post above!</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Text</th><th>Sentiment</th><th>Confidence</th><th>Time</th><th></th>
              </tr>
            </thead>
            <tbody>
              {history.map((h) => (
                <tr key={h.id}>
                  <td style={{ maxWidth: 380 }}>{h.text}</td>
                  <td><span className={`badge ${h.sentiment}`}>{h.sentiment}</span></td>
                  <td>{(h.confidence * 100).toFixed(1)}%</td>
                  <td style={{ color: "var(--muted)", fontSize: ".8rem" }}>
                    {new Date(h.timestamp + "Z").toLocaleString()}
                  </td>
                  <td>
                    <button className="btn btn-ghost" onClick={() => onDelete(h.id)} title="Delete">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
