"use client";

import { useMemo, useState } from "react";
import { Grant, OrgType } from "@/lib/types";
import { formatOriginal, formatUsd, rankByCompany } from "@/lib/aggregate";

const ORG_FILTERS: ("ALL" | OrgType)[] = [
  "ALL",
  "スタートアップ",
  "大手・既存",
  "コンソーシアム等",
];

export default function SourcingView({ grants }: { grants: Grant[] }) {
  const [org, setOrg] = useState<"ALL" | OrgType>("スタートアップ");
  const [country, setCountry] = useState<"ALL" | "US" | "JP">("ALL");

  const filtered = useMemo(
    () =>
      grants
        .filter((g) => (org === "ALL" ? true : g.orgType === org))
        .filter((g) => (country === "ALL" ? true : g.country === country)),
    [grants, org, country]
  );

  const timeline = useMemo(
    () =>
      [...filtered]
        .filter((g) => g.awardDate)
        .sort((a, b) => b.awardDate.localeCompare(a.awardDate)),
    [filtered]
  );

  const ranking = useMemo(() => rankByCompany(filtered).slice(0, 15), [filtered]);

  return (
    <div className="space-y-6">
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <span className="text-sm text-slate-300">企業区分:</span>
        {ORG_FILTERS.map((o) => (
          <button
            key={o}
            onClick={() => setOrg(o)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              org === o
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {o === "ALL" ? "すべて" : o}
          </button>
        ))}
        <span className="ml-4 text-sm text-slate-300">国:</span>
        {(["ALL", "US", "JP"] as const).map((c) => (
          <button
            key={c}
            onClick={() => setCountry(c)}
            className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
              country === c
                ? "border-cyan-400/60 bg-cyan-400/15 text-cyan-200"
                : "border-white/15 bg-white/5 text-slate-300 hover:bg-white/10"
            }`}
          >
            {c === "ALL" ? "すべて" : c === "US" ? "米国" : "日本"}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* 獲得ランキング */}
        <div className="glass rounded-2xl p-5 lg:col-span-2">
          <h2 className="mb-3 text-base font-semibold text-white">
            政府資金 獲得ランキング
            {org !== "ALL" && (
              <span className="ml-2 rounded bg-cyan-400/15 px-2 py-0.5 text-xs font-normal text-cyan-200">
                {org}
              </span>
            )}
          </h2>
          <ol className="space-y-2">
            {ranking.map((r, i) => (
              <li
                key={`${r.company}-${r.country}`}
                className="flex items-baseline justify-between gap-2 border-b border-white/5 pb-2"
              >
                <div className="flex min-w-0 items-baseline gap-2">
                  <span className="w-5 shrink-0 text-right text-xs text-slate-400">
                    {i + 1}
                  </span>
                  <span className="truncate text-sm font-medium text-slate-100">
                    {r.company}
                  </span>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] ${
                      r.country === "US"
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {r.country === "US" ? "米" : "日"}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-sm font-medium text-cyan-300">
                    {formatUsd(r.totalUsd)}
                  </div>
                  <div className="text-[10px] text-slate-400">{r.count}件</div>
                </div>
              </li>
            ))}
            {ranking.length === 0 && (
              <li className="py-6 text-center text-sm text-slate-400">
                該当する企業がありません
              </li>
            )}
          </ol>
        </div>

        {/* 時系列の動き */}
        <div className="glass rounded-2xl p-5 lg:col-span-3">
          <h2 className="mb-3 text-base font-semibold text-white">
            最近の資金獲得の動き（新しい順）
          </h2>
          <div className="space-y-3">
            {timeline.slice(0, 30).map((g) => (
              <div
                key={g.id}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-3"
              >
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="text-slate-400">{g.awardDate}</span>
                  <span
                    className={`rounded px-1.5 py-0.5 ${
                      g.country === "US"
                        ? "bg-blue-500/20 text-blue-200"
                        : "bg-rose-500/20 text-rose-200"
                    }`}
                  >
                    {g.country === "US" ? "米国" : "日本"}
                  </span>
                  {g.orgType === "スタートアップ" && (
                    <span className="rounded bg-emerald-400/15 px-1.5 py-0.5 text-emerald-200">
                      スタートアップ
                    </span>
                  )}
                  <span className="rounded bg-white/10 px-1.5 py-0.5 text-slate-300">
                    {g.theme}
                  </span>
                </div>
                <div className="mt-1.5 flex flex-wrap items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <span className="text-sm font-semibold text-white">
                      {g.company}
                    </span>
                    <span className="ml-2 text-xs text-slate-300">
                      {g.agency} / {g.program}
                    </span>
                  </div>
                  <div className="shrink-0 text-sm font-medium text-cyan-300">
                    {formatUsd(g.amountUsd)}
                    {g.currency !== "USD" && (
                      <span className="ml-1 text-xs font-normal text-slate-400">
                        （{formatOriginal(g.amountOriginal, g.currency)}）
                      </span>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-xs text-slate-400">{g.description}</p>
                <a
                  href={g.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-cyan-400 hover:underline"
                >
                  出典 ↗
                </a>
              </div>
            ))}
            {timeline.length === 0 && (
              <p className="py-6 text-center text-sm text-slate-400">
                該当する案件がありません
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
