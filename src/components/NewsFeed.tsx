"use client";

import { useState } from "react";
import { NewsItem, NewsType } from "@/lib/types";

export default function NewsFeed({ items }: { items: NewsItem[] }) {
  const [type, setType] = useState<"ALL" | "OPEN" | NewsType>("ALL");
  const [country, setCountry] = useState<"ALL" | "US" | "JP">("ALL");

  const filtered = items
    .filter((n) =>
      type === "ALL" ? true : type === "OPEN" ? n.type === "公募" && n.open : n.type === type
    )
    .filter((n) => (country === "ALL" ? true : n.country === country));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterGroup
          value={type}
          onChange={(v) => setType(v as "ALL" | "OPEN" | NewsType)}
          options={[
            ["ALL", "すべて"],
            ["OPEN", "🟢 募集中"],
            ["公募", "公募"],
            ["採択", "採択"],
          ]}
        />
        <FilterGroup
          value={country}
          onChange={(v) => setCountry(v as "ALL" | "US" | "JP")}
          options={[
            ["ALL", "全地域"],
            ["US", "米国"],
            ["JP", "日本"],
          ]}
        />
      </div>

      <ul className="space-y-3">
        {filtered.map((n) => (
          <li
            key={n.id}
            className="glass rounded-2xl p-4 transition-colors hover:border-white/20"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={
                  n.type === "公募"
                    ? "rounded bg-emerald-400/20 px-2 py-0.5 font-medium text-emerald-200"
                    : "rounded bg-indigo-400/20 px-2 py-0.5 font-medium text-indigo-200"
                }
              >
                {n.type}
              </span>
              {n.open && (
                <span className="rounded bg-emerald-400/25 px-2 py-0.5 font-medium text-emerald-100">
                  🟢 募集中
                </span>
              )}
              <span
                className={
                  n.country === "US"
                    ? "rounded bg-blue-500/20 px-2 py-0.5 text-blue-200"
                    : "rounded bg-rose-500/20 px-2 py-0.5 text-rose-200"
                }
              >
                {n.country === "US" ? "米国" : "日本"}
              </span>
              <span className="text-slate-400">{n.date}</span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-300">{n.agency}</span>
            </div>
            <h2 className="text-base font-semibold text-white">{n.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{n.summary}</p>
            {n.deadline && (
              <p className="mt-1 text-sm font-medium text-rose-300">
                応募締切: {n.deadline}
              </p>
            )}
            <a
              href={n.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-cyan-400 hover:underline"
            >
              出典を見る ↗
            </a>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="glass rounded-2xl p-8 text-center text-slate-400">
            該当するニュースがありません
          </li>
        )}
      </ul>
    </div>
  );
}

function FilterGroup({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: [string, string][];
}) {
  return (
    <div className="inline-flex overflow-hidden rounded-md border border-white/15">
      {options.map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={
            value === val
              ? "bg-cyan-500 px-3 py-1.5 text-sm font-medium text-slate-950"
              : "bg-white/5 px-3 py-1.5 text-sm text-slate-300 hover:bg-white/10"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
