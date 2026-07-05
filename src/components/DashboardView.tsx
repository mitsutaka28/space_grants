"use client";

import { useMemo, useState } from "react";
import { Grant, OrgType, Theme } from "@/lib/types";
import {
  aggregateByAgency,
  aggregateByCountry,
  aggregateByTheme,
  aggregateByYear,
  formatUsd,
  rankByCompany,
} from "@/lib/aggregate";
import CompanyRankingChart from "@/components/CompanyRankingChart";
import ThemePieChart from "@/components/ThemePieChart";
import YearlyTrendChart from "@/components/YearlyTrendChart";
import CompanyRankingTable from "@/components/CompanyRankingTable";

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

const ORG_TYPES: OrgType[] = ["スタートアップ", "大手・既存", "コンソーシアム等"];

export default function DashboardView({ grants }: { grants: Grant[] }) {
  const years = useMemo(
    () => Array.from(new Set(grants.map((g) => g.fiscalYear))).sort((a, b) => a - b),
    [grants]
  );

  const [yearFrom, setYearFrom] = useState<"ALL" | number>("ALL");
  const [yearTo, setYearTo] = useState<"ALL" | number>("ALL");
  const [country, setCountry] = useState<"ALL" | "US" | "JP">("ALL");
  const [theme, setTheme] = useState<"ALL" | Theme>("ALL");
  const [org, setOrg] = useState<"ALL" | OrgType>("ALL");

  const filtered = useMemo(
    () =>
      grants
        .filter((g) => (yearFrom === "ALL" ? true : g.fiscalYear >= yearFrom))
        .filter((g) => (yearTo === "ALL" ? true : g.fiscalYear <= yearTo))
        .filter((g) => (country === "ALL" ? true : g.country === country))
        .filter((g) => (theme === "ALL" ? true : g.theme === theme))
        .filter((g) => (org === "ALL" ? true : g.orgType === org)),
    [grants, yearFrom, yearTo, country, theme, org]
  );

  const fullRanking = useMemo(() => rankByCompany(filtered), [filtered]);
  const companyRanking = fullRanking.slice(0, 12);
  const themeAgg = useMemo(() => aggregateByTheme(filtered), [filtered]);
  const countryAgg = useMemo(() => aggregateByCountry(filtered), [filtered]);
  const yearAgg = useMemo(() => aggregateByYear(filtered), [filtered]);
  const agencyAgg = useMemo(() => aggregateByAgency(filtered).slice(0, 10), [filtered]);
  const totalUsd = filtered.reduce((sum, g) => sum + g.amountUsd, 0);

  const us = countryAgg.find((c) => c.country === "US");
  const jp = countryAgg.find((c) => c.country === "JP");

  const hasFilter =
    yearFrom !== "ALL" || yearTo !== "ALL" || country !== "ALL" || theme !== "ALL" || org !== "ALL";

  const selectCls =
    "rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-100";

  return (
    <div className="space-y-8">
      {/* フィルターバー */}
      <div className="glass flex flex-wrap items-center gap-3 rounded-2xl p-4">
        <span className="text-sm text-slate-300">期間:</span>
        <select
          value={yearFrom}
          onChange={(e) =>
            setYearFrom(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
          }
          className={selectCls}
        >
          <option value="ALL">開始年度</option>
          {years.map((y) => (
            <option key={y} value={y}>
              {y}年度〜
            </option>
          ))}
        </select>
        <select
          value={yearTo}
          onChange={(e) =>
            setYearTo(e.target.value === "ALL" ? "ALL" : Number(e.target.value))
          }
          className={selectCls}
        >
          <option value="ALL">終了年度</option>
          {years.map((y) => (
            <option key={y} value={y}>
              〜{y}年度
            </option>
          ))}
        </select>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value as "ALL" | "US" | "JP")}
          className={selectCls}
        >
          <option value="ALL">国: すべて</option>
          <option value="US">米国</option>
          <option value="JP">日本</option>
        </select>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as "ALL" | Theme)}
          className={selectCls}
        >
          <option value="ALL">テーマ: すべて</option>
          {THEMES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select
          value={org}
          onChange={(e) => setOrg(e.target.value as "ALL" | OrgType)}
          className={selectCls}
        >
          <option value="ALL">企業区分: すべて</option>
          {ORG_TYPES.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        {hasFilter && (
          <button
            onClick={() => {
              setYearFrom("ALL");
              setYearTo("ALL");
              setCountry("ALL");
              setTheme("ALL");
              setOrg("ALL");
            }}
            className="rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:bg-white/10"
          >
            リセット ✕
          </button>
        )}
        <span className="ml-auto text-sm text-slate-300">
          {filtered.length}件 / {formatUsd(totalUsd)}
        </span>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard label="総獲得金額" value={formatUsd(totalUsd)} accent="text-cyan-300" />
        <SummaryCard label="案件数" value={`${filtered.length}件`} />
        <SummaryCard
          label="米国 (合計)"
          value={`${formatUsd(us?.totalUsd ?? 0)} / ${us?.count ?? 0}件`}
          accent="text-blue-300"
        />
        <SummaryCard
          label="日本 (合計)"
          value={`${formatUsd(jp?.totalUsd ?? 0)} / ${jp?.count ?? 0}件`}
          accent="text-rose-300"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="企業別 獲得金額ランキング（上位12社）">
          <CompanyRankingChart data={companyRanking} />
          <p className="mt-2 text-xs text-slate-400">■ 青: 米国企業　■ 赤: 日本企業</p>
        </Card>
        <Card title="テーマ別 獲得金額シェア">
          <ThemePieChart data={themeAgg} />
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card title="年度別 獲得金額推移（米日比較）">
          <YearlyTrendChart data={yearAgg} />
        </Card>
        <Card title="機関別 獲得金額ランキング（上位10機関）">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 text-left text-slate-400">
                <th className="py-2 font-medium">機関</th>
                <th className="py-2 font-medium">国</th>
                <th className="py-2 text-right font-medium">獲得金額</th>
                <th className="py-2 text-right font-medium">件数</th>
              </tr>
            </thead>
            <tbody>
              {agencyAgg.map((a) => (
                <tr key={a.agency} className="border-b border-white/5">
                  <td className="py-2 font-medium text-slate-100">{a.agency}</td>
                  <td className="py-2">
                    <span
                      className={
                        a.country === "US"
                          ? "rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-200"
                          : "rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-200"
                      }
                    >
                      {a.country === "US" ? "米国" : "日本"}
                    </span>
                  </td>
                  <td className="py-2 text-right text-cyan-300">{formatUsd(a.totalUsd)}</td>
                  <td className="py-2 text-right text-slate-300">{a.count}</td>
                </tr>
              ))}
              {agencyAgg.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-slate-400">
                    該当なし
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </section>

      <Card title="企業ランキング詳細">
        <p className="mb-3 text-xs text-slate-400">
          企業名の行をクリックすると、その金額を構成する採択・契約の内訳（出典リンク付き）が開きます。
        </p>
        <CompanyRankingTable ranking={fullRanking} grants={filtered} />
      </Card>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5">
      <h2 className="mb-3 text-sm font-semibold text-slate-200">{title}</h2>
      {children}
    </div>
  );
}

function SummaryCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-xs text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ?? "text-white"}`}>{value}</p>
    </div>
  );
}
