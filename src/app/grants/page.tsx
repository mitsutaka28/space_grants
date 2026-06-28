import { grants } from "@/data/grants";
import GrantsExplorer from "@/components/GrantsExplorer";

export default function GrantsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">案件一覧・検索</h1>
        <p className="text-sm text-slate-300">
          米国・日本の宇宙・防衛関連の実在の契約・補助金を検索・フィルタできます。各案件は出典リンクで検証可能です。
        </p>
      </div>
      <details className="glass rounded-2xl p-4 text-sm text-slate-300">
        <summary className="cursor-pointer font-medium text-slate-100">
          データソースと収集範囲について
        </summary>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            <span className="text-slate-100">手動キュレーション</span>:
            公式発表・報道に基づく主要な契約・補助金（米: NSSL / NASA HLS / MDA / SDA / NRO、日: 防衛省 /
            文科省SBIR / 宇宙戦略基金 / 内閣府 / JAXA など）。
          </li>
          <li>
            <span className="text-slate-100">自動収集（週次）</span>:
            USAspending.gov（連邦の契約・補助金）と SBIR.gov（SBIR/STTR 交付）から、宇宙・防衛キーワードで
            複数省庁分を取得。「自動収集」バッジ付きで表示。
          </li>
          <li>
            日本は公開APIが乏しいため手動キュレーション中心。円は参考レート 1USD=150円 で換算。
          </li>
        </ul>
      </details>
      <GrantsExplorer grants={grants} />
    </div>
  );
}
