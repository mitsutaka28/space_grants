"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CompanyAgg, formatUsd } from "@/lib/aggregate";

const COUNTRY_COLOR: Record<string, string> = {
  US: "#60a5fa",
  JP: "#fb7185",
};

export default function CompanyRankingChart({ data }: { data: CompanyAgg[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(255,255,255,0.08)" />
        <XAxis
          type="number"
          tickFormatter={(v) => formatUsd(v)}
          tick={{ fontSize: 11, fill: "#94a3b8" }}
        />
        <YAxis
          type="category"
          dataKey="company"
          width={160}
          tick={{ fontSize: 12, fill: "#cbd5e1" }}
        />
        <Tooltip
          formatter={(value) => formatUsd(Number(value))}
          contentStyle={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: 8,
            color: "#e2e8f0",
          }}
        />
        <Bar dataKey="totalUsd" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COUNTRY_COLOR[entry.country]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
