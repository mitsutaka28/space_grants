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
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="fiscalYear" tickFormatter={(v) => `${v}年度`} />
        <YAxis tickFormatter={(v) => formatUsd(v)} width={70} />
        <Tooltip
          formatter={(value, name) => [formatUsd(Number(value)), name === "US" ? "米国" : "日本"]}
          labelFormatter={(label) => `${label}年度`}
        />
        <Legend formatter={(value) => (value === "US" ? "米国" : "日本")} />
        <Bar dataKey="US" stackId="a" fill="#2563eb" />
        <Bar dataKey="JP" stackId="a" fill="#dc2626" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
