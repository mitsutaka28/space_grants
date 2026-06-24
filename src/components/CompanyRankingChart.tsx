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
  US: "#2563eb",
  JP: "#dc2626",
};

export default function CompanyRankingChart({ data }: { data: CompanyAgg[] }) {
  return (
    <ResponsiveContainer width="100%" height={420}>
      <BarChart data={data} layout="vertical" margin={{ left: 24, right: 24 }}>
        <CartesianGrid strokeDasharray="3 3" horizontal={false} />
        <XAxis type="number" tickFormatter={(v) => formatUsd(v)} />
        <YAxis type="category" dataKey="company" width={160} tick={{ fontSize: 12 }} />
        <Tooltip formatter={(value) => formatUsd(Number(value))} />
        <Bar dataKey="totalUsd" radius={[0, 4, 4, 0]}>
          {data.map((entry, i) => (
            <Cell key={i} fill={COUNTRY_COLOR[entry.country]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
