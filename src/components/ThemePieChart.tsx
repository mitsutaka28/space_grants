"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ThemeAgg, formatUsd } from "@/lib/aggregate";

const COLORS = [
  "#2563eb",
  "#dc2626",
  "#16a34a",
  "#d97706",
  "#7c3aed",
  "#0891b2",
  "#db2777",
  "#65a30d",
  "#475569",
  "#ea580c",
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
          outerRadius={140}
          label={(entry) => entry.name}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatUsd(Number(value))} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
