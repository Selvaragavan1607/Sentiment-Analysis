import React from "react";
import ProbabilityChart from "./ProbabilityChart.jsx";
import jsPDF from "jspdf";

export default function ResultCard({ result }) {
  if (!result) return null;
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Sentiment Analysis Report", 14, 20);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleString()}`, 14, 30);
    doc.text(`Sentiment: ${result.sentiment}`, 14, 42);
    doc.text(`Confidence: ${(result.confidence * 100).toFixed(2)}%`, 14, 50);
    doc.text("Original Text:", 14, 62);
    doc.text(doc.splitTextToSize(result.original || "", 180), 14, 70);
    doc.text("Processed Text:", 14, 110);
    doc.text(doc.splitTextToSize(result.processed_text || "", 180), 14, 118);
    doc.text("Probabilities:", 14, 150);
    Object.entries(result.probabilities).forEach(([k, v], i) => {
      doc.text(`  ${k}: ${(v * 100).toFixed(2)}%`, 14, 158 + i * 8);
    });
    doc.save(`sentiment-report-${Date.now()}.pdf`);
  };
  return (
    <div className="card">
      <div className="result-grid">
        <div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem" }}>PREDICTED SENTIMENT</div>
          <div style={{ margin: "8px 0" }}><span className={`badge ${result.sentiment}`}>{result.sentiment}</span></div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem", marginTop: 12 }}>CONFIDENCE</div>
          <div className="confidence">{(result.confidence * 100).toFixed(1)}%</div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem", margin: "8px 0 4px" }}>PROCESSED TEXT</div>
          <div className="processed">{result.processed_text || "—"}</div>
          <div className="row">
            <button className="btn" onClick={downloadPDF}>📄 Download PDF</button>
          </div>
        </div>
        <div>
          <div style={{ color: "var(--muted)", fontSize: ".85rem", marginBottom: 8 }}>PROBABILITY DISTRIBUTION</div>
          <ProbabilityChart probabilities={result.probabilities} />
        </div>
      </div>
    </div>
  );
}
