import { grants } from "@/data/grants";
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

export default function Home() {
  const fullRanking = rankByCompany(grants);
  const companyRanking = fullRanking.slice(0, 12);
  const themeAgg = aggregateByTheme(grants);
  const countryAgg = aggregateByCountry(grants);
  const yearAgg = aggregateByYear(grants);
  const agencyAgg = aggregateByAgency(grants).slice(0, 10);
  const totalUsd = grants.reduce((sum, g) => sum + g.amountUsd, 0);

  const us = countryAgg.find((c) => c.country === "US");
  const jp = countryAgg.find((c) => c.country === "JP");

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-4">
        <SummaryCard label="総獲得金額" value={formatUsd(totalUsd)} accent="text-cyan-300" />
        <SummaryCard label="案件数" value={`${grants.length}件`} />
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
            </tbody>
          </table>
        </Card>
      </section>

      <Card title="企業ランキング詳細">
        <p className="mb-3 text-xs text-slate-400">
          企業名の行をクリックすると、その金額を構成する採択・契約の内訳（出典リンク付き）が開きます。
        </p>
        <CompanyRankingTable ranking={fullRanking} grants={grants} />
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
