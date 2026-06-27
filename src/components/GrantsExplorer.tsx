"use client";

import { useMemo, useState } from "react";
import { Grant, Theme } from "@/lib/types";
import { formatUsd } from "@/lib/aggregate";

const THEMES: Theme[] = [
  "衛星・リモートセンシング",
  "ロケット・打上げ",
  "推進システム",
  "宇宙状況監視(SSA)",
  "ミサイル防衛",
  "無人機・自律システム",
  "サイバー防衛",
  "AI・指揮統制",
  "月・深宇宙探査",
  "通信・データリンク",
];

export default function GrantsExplorer({ grants }: { grants: Grant[] }) {
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState<"ALL" | "US" | "JP">("ALL");
  const [theme, setTheme] = useState<"ALL" | Theme>("ALL");
  const [sortDesc, setSortDesc] = useState(true);

  const years = useMemo(
    () => Array.from(new Set(grants.map((g) => g.fiscalYear))).sort((a, b) => b - a),
    [grants]
  );
  const [year, setYear] = useState<"ALL" | number>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return grants
      .filter((g) => (country === "ALL" ? true : g.country === country))
      .filter((g) => (theme === "ALL" ? true : g.theme === theme))
      .filter((g) => (year === "ALL" ? true : g.fiscalYear === year))
      .filter((g) =>
        q
          ? g.company.toLowerCase().includes(q) ||
            g.agency.toLowerCase().includes(q) ||
            g.program.toLowerCase().includes(q) ||
            g.description.toLowerCase().includes(q)
          : true
      )
      .sort((a, b) => (sortDesc ? b.amountUsd - a.amountUsd : a.amountUsd - b.amountUsd));
  }, [grants, query, country, theme, year, sortDesc]);

  const totalUsd = filtered.reduce((sum, g) => sum + g.amountUsd, 0);

  const exportCsv = () => {
    const headers = [
      "id",
      "company",
      "country",
      "agency",
      "program",
      "theme",
      "amountUsd",
      "fiscalYear",
      "awardDate",
      "description",
      "sourceUrl",
    ];
    const escape = (v: string | number) => {
      const s = String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const rows = filtered.map((g) =>
      headers.map((h) => escape(g[h as keyof Grant])).join(",")
    );
    const csv = "﻿" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `space_grants_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 rounded-xl border border-zinc-200 bg-white p-4">
        <input
          type="text"
          placeholder="企業名・機関・プログラム・キーワードで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[260px] flex-1 rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as "ALL" | "US" | "JP")}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="ALL">国: すべて</option>
          <option value="US">米国</option>
          <option value="JP">日本</option>
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "ALL" | Theme)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="ALL">テーマ: すべて</option>
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={year}
          onChange={(e) =>
            setYear(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
          }
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm"
        >
          <option value="ALL">年度: すべて</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}年度
            </option>
          ))}
        </select>
        <button
          onClick={() => setSortDesc((s) => !s)}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm hover:bg-zinc-50"
        >
          金額 {sortDesc ? "降順" : "昇順"} ↕
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-500">
          {filtered.length}件 / 合計 {formatUsd(totalUsd)}
        </p>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="rounded-md border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          CSVダウンロード ⬇
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500">
              <th className="px-4 py-2">企業</th>
              <th className="px-4 py-2">国</th>
              <th className="px-4 py-2">機関</th>
              <th className="px-4 py-2">プログラム</th>
              <th className="px-4 py-2">テーマ</th>
              <th className="px-4 py-2 text-right">金額</th>
              <th className="px-4 py-2">年度</th>
              <th className="px-4 py-2">採択日</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b border-zinc-100 align-top">
                <td className="px-4 py-2 font-medium">{g.company}</td>
                <td className="px-4 py-2">
                  <span
                    className={
                      g.country === "US"
                        ? "rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                        : "rounded bg-red-50 px-2 py-0.5 text-xs text-red-700"
                    }
                  >
                    {g.country === "US" ? "米国" : "日本"}
                  </span>
                </td>
                <td className="px-4 py-2 text-zinc-600">{g.agency}</td>
                <td className="px-4 py-2 text-zinc-600">
                  <div className="font-medium text-zinc-800">{g.program}</div>
                  <div className="text-xs text-zinc-400">{g.description}</div>
                </td>
                <td className="px-4 py-2">
                  <span className="rounded bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                    {g.theme}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-medium">
                  {formatUsd(g.amountUsd)}
                </td>
                <td className="px-4 py-2 text-zinc-600">{g.fiscalYear}</td>
                <td className="px-4 py-2 text-zinc-600">{g.awardDate}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-zinc-400">
                  該当する案件がありません
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
