"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ThemeAgg, formatUsd } from "@/lib/aggregate";

const COLORS = [
  "#60a5fa",
  "#fb7185",
  "#34d399",
  "#fbbf24",
  "#a78bfa",
  "#22d3ee",
  "#f472b6",
  "#a3e635",
  "#94a3b8",
  "#fb923c",
];

export default function ThemePieChart({ data }: { data: ThemeAgg[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalUsd"
          nameKey="theme"
          cx="50%"
          cy="50%"
          outerRadius={130}
          label={({ percent }) =>
            percent && percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ""
          }
          labelLine={false}
          stroke="rgba(5,6,15,0.6)"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => formatUsd(Number(value))}
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            color: "#e2e8f0",
          }}
        />
        <Legend wrapperStyle={{ color: "#cbd5e1", fontSize: 12 }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
