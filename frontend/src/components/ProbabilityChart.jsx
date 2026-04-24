import React from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const COLORS = { Positive: "#10b981", Negative: "#ef4444", Neutral: "#f59e0b" };

export default function ProbabilityChart({ probabilities }) {
  const data = Object.entries(probabilities).map(([name, value]) => ({
    name, value: +(value * 100).toFixed(1),
  }));
  return (
    <div style={{ width: "100%", height: 220 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="var(--muted)" />
          <YAxis stroke="var(--muted)" unit="%" />
          <Tooltip
            cursor={{ fill: "rgba(99,102,241,.08)" }}
            contentStyle={{
              background: "var(--surface)", border: "1px solid var(--border)",
              borderRadius: 8, color: "var(--text)",
            }}
            formatter={(v) => `${v}%`}
          />
          <Bar dataKey="value" radius={[8, 8, 0, 0]}>
            {data.map((d) => <Cell key={d.name} fill={COLORS[d.name] || "#6366f1"} />)}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
