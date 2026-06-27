"use client";

import { useState } from "react";
import { NewsItem, NewsType } from "@/lib/types";

export default function NewsFeed({ items }: { items: NewsItem[] }) {
  const [type, setType] = useState<"ALL" | NewsType>("ALL");
  const [country, setCountry] = useState<"ALL" | "US" | "JP">("ALL");

  const filtered = items
    .filter((n) => (type === "ALL" ? true : n.type === type))
    .filter((n) => (country === "ALL" ? true : n.country === country));

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterGroup
          value={type}
          onChange={(v) => setType(v as "ALL" | NewsType)}
          options={[
            ["ALL", "すべて"],
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
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-300"
          >
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
              <span
                className={
                  n.type === "公募"
                    ? "rounded bg-emerald-100 px-2 py-0.5 font-medium text-emerald-800"
                    : "rounded bg-indigo-100 px-2 py-0.5 font-medium text-indigo-800"
                }
              >
                {n.type}
              </span>
              <span
                className={
                  n.country === "US"
                    ? "rounded bg-blue-50 px-2 py-0.5 text-blue-700"
                    : "rounded bg-red-50 px-2 py-0.5 text-red-700"
                }
              >
                {n.country === "US" ? "米国" : "日本"}
              </span>
              <span className="text-zinc-500">{n.date}</span>
              <span className="text-zinc-500">·</span>
              <span className="text-zinc-600">{n.agency}</span>
            </div>
            <h2 className="text-base font-semibold text-zinc-900">{n.title}</h2>
            <p className="mt-1 text-sm leading-relaxed text-zinc-700">{n.summary}</p>
            {n.deadline && (
              <p className="mt-1 text-sm font-medium text-rose-700">
                応募締切: {n.deadline}
              </p>
            )}
            <a
              href={n.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-sm font-medium text-blue-600 hover:underline"
            >
              出典を見る ↗
            </a>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="rounded-xl border border-zinc-200 bg-white p-8 text-center text-zinc-500">
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
    <div className="inline-flex overflow-hidden rounded-md border border-zinc-300">
      {options.map(([val, label]) => (
        <button
          key={val}
          onClick={() => onChange(val)}
          className={
            value === val
              ? "bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white"
              : "bg-white px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50"
          }
        >
          {label}
        </button>
      ))}
    </div>
  );
}
