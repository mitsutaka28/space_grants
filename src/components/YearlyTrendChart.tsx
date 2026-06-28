"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { YearAgg, formatUsd } from "@/lib/aggregate";

export default function YearlyTrendChart({ data }: { data: YearAgg[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} margin={{ left: 12, right: 12 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.08)" />
        <XAxis
          dataKey="fiscalYear"
          tickFormatter={(v) => `${v}年度`}
          tick={{ fontSize: 12, fill: "#cbd5e1" }}
        />
        <YAxis
          tickFormatter={(v) => formatUsd(v)}
          width={70}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <Tooltip
          formatter={(value, name) => [formatUsd(Number(value)), name === "US" ? "米国" : "日本"]}
          labelFormatter={(label) => `${label}年度`}
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            color: "#e2e8f0",
          }}
          cursor={{ fill: "rgba(255,255,255,0.05)" }}
        />
        <Legend formatter={(value) => (value === "US" ? "米国" : "日本")} />
        <Bar dataKey="US" stackId="a" fill="#60a5fa" />
        <Bar dataKey="JP" stackId="a" fill="#fb7185" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
