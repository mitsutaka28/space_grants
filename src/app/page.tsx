import { grants } from "@/data/grants";
import {
  aggregateByCountry,
  aggregateByTheme,
  formatUsd,
  rankByCompany,
} from "@/lib/aggregate";
import CompanyRankingChart from "@/components/CompanyRankingChart";
import ThemePieChart from "@/components/ThemePieChart";

export default function Home() {
  const companyRanking = rankByCompany(grants).slice(0, 12);
  const themeAgg = aggregateByTheme(grants);
  const countryAgg = aggregateByCountry(grants);
  const totalUsd = grants.reduce((sum, g) => sum + g.amountUsd, 0);

  const us = countryAgg.find((c) => c.country === "US");
  const jp = countryAgg.find((c) => c.country === "JP");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard label="総獲得金額" value={formatUsd(totalUsd)} />
        <SummaryCard label="案件数" value={`${grants.length}件`} />
        <SummaryCard
          label="米国 (合計)"
          value={`${formatUsd(us?.totalUsd ?? 0)} / ${us?.count ?? 0}件`}
          accent="text-blue-600"
        />
        <SummaryCard
          label="日本 (合計)"
          value={`${formatUsd(jp?.totalUsd ?? 0)} / ${jp?.count ?? 0}件`}
          accent="text-red-600"
        />
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-zinc-700">
            企業別 獲得金額ランキング（上位12社）
          </h2>
          <CompanyRankingChart data={companyRanking} />
          <p className="mt-2 text-xs text-zinc-400">
            ■ 青: 米国企業　■ 赤: 日本企業
          </p>
        </div>
        <div className="rounded-xl border border-zinc-200 bg-white p-5">
          <h2 className="mb-3 text-sm font-semibold text-zinc-700">
            テーマ別 獲得金額シェア
          </h2>
          <ThemePieChart data={themeAgg} />
        </div>
      </section>

      <section className="rounded-xl border border-zinc-200 bg-white p-5">
        <h2 className="mb-3 text-sm font-semibold text-zinc-700">
          企業ランキング詳細
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-200 text-left text-zinc-500">
              <th className="py-2">#</th>
              <th className="py-2">企業名</th>
              <th className="py-2">国</th>
              <th className="py-2 text-right">獲得金額</th>
              <th className="py-2 text-right">件数</th>
            </tr>
          </thead>
          <tbody>
            {rankByCompany(grants).map((c, i) => (
              <tr key={`${c.company}-${c.country}`} className="border-b border-zinc-100">
                <td className="py-2 text-zinc-400">{i + 1}</td>
                <td className="py-2 font-medium">{c.company}</td>
                <td className="py-2">
                  <span
                    className={
                      c.country === "US"
                        ? "rounded bg-blue-50 px-2 py-0.5 text-xs text-blue-700"
                        : "rounded bg-red-50 px-2 py-0.5 text-xs text-red-700"
                    }
                  >
                    {c.country === "US" ? "米国" : "日本"}
                  </span>
                </td>
                <td className="py-2 text-right">{formatUsd(c.totalUsd)}</td>
                <td className="py-2 text-right">{c.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
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
    <div className="rounded-xl border border-zinc-200 bg-white p-5">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className={`mt-1 text-2xl font-semibold ${accent ?? ""}`}>{value}</p>
    </div>
  );
}
