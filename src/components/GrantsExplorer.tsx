"use client";

import { useMemo, useState } from "react";
import { Grant, Theme } from "@/lib/types";
import { formatOriginal, formatUsd } from "@/lib/aggregate";

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
      "amountOriginal",
      "currency",
      "fiscalYear",
      "awardDate",
      "description",
      "sourceUrl",
    ];
    const escape = (v: string | number | boolean | undefined) => {
      const s = String(v ?? "");
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
      <div className="glass flex flex-wrap gap-3 rounded-2xl p-4">
        <input
          type="text"
          placeholder="企業名・機関・プログラム・キーワードで検索"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-[260px] flex-1 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100 placeholder-slate-400 focus:border-cyan-400/60 focus:outline-none"
        />
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as "ALL" | "US" | "JP")}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100"
        >
          <option value="ALL">国: すべて</option>
          <option value="US">米国</option>
          <option value="JP">日本</option>
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "ALL" | Theme)}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100"
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
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100"
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
          className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-200 hover:bg-white/10"
        >
          金額 {sortDesc ? "降順" : "昇順"} ↕
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-300">
          {filtered.length}件 / 合計 <span className="text-cyan-300">{formatUsd(totalUsd)}</span>
        </p>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="rounded-md border border-white/15 bg-white/5 px-3 py-1.5 text-sm text-slate-200 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
        >
          CSVダウンロード ⬇
        </button>
      </div>

      <div className="glass overflow-x-auto rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              <th className="px-4 py-2 font-medium">企業</th>
              <th className="px-4 py-2 font-medium">国</th>
              <th className="px-4 py-2 font-medium">機関</th>
              <th className="px-4 py-2 font-medium">プログラム</th>
              <th className="px-4 py-2 font-medium">テーマ</th>
              <th className="px-4 py-2 text-right font-medium">金額 (USD)</th>
              <th className="px-4 py-2 font-medium">年度</th>
              <th className="px-4 py-2 font-medium">採択日</th>
              <th className="px-4 py-2 font-medium">出典</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((g) => (
              <tr key={g.id} className="border-b border-white/5 align-top hover:bg-white/5">
                <td className="px-4 py-2 font-medium text-white">
                  {g.company}
                  {g.orgType === "スタートアップ" && (
                    <span className="ml-1 rounded bg-emerald-400/15 px-1.5 py-0.5 text-[10px] font-normal text-emerald-200">
                      スタートアップ
                    </span>
                  )}
                  {g.auto && (
                    <span className="ml-1 rounded bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-normal text-amber-200">
                      自動収集
                    </span>
                  )}
                </td>
                <td className="px-4 py-2">
                  <span
                    className={
                      g.country === "US"
                        ? "rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-200"
                        : "rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-200"
                    }
                  >
                    {g.country === "US" ? "米国" : "日本"}
                  </span>
                </td>
                <td className="px-4 py-2 text-slate-300">{g.agency}</td>
                <td className="px-4 py-2 text-slate-300">
                  <div className="font-medium text-slate-100">{g.program}</div>
                  <div className="text-xs text-slate-400">{g.description}</div>
                </td>
                <td className="px-4 py-2">
                  <span className="rounded bg-white/10 px-2 py-0.5 text-xs text-slate-200">
                    {g.theme}
                  </span>
                </td>
                <td className="px-4 py-2 text-right font-medium text-cyan-300">
                  {g.amountUnknown ? (
                    <span className="text-slate-400">金額不明</span>
                  ) : (
                    formatUsd(g.amountUsd)
                  )}
                  {!g.amountUnknown && g.currency !== "USD" && (
                    <div className="text-xs font-normal text-slate-400">
                      {formatOriginal(g.amountOriginal, g.currency)}
                    </div>
                  )}
                </td>
                <td className="px-4 py-2 text-slate-300">{g.fiscalYear}</td>
                <td className="px-4 py-2 text-slate-300">{g.awardDate}</td>
                <td className="px-4 py-2">
                  <a
                    href={g.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-400 hover:underline"
                  >
                    リンク ↗
                  </a>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-slate-400">
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
