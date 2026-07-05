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
            <span className="text-slate-100">自動収集（日次）</span>:
            SpaceNews / NASA / 米国防省のRSSフィードに加え、JAXA・宇宙戦略基金・防衛省・文科省の
            公式お知らせページをクローリングし、宇宙・防衛キーワードと金額表記を検出して抽出。
            構造化APIへの直接問い合わせは行わず、公開されている記事・発表ページのみを参照。「自動収集」バッジ付きで表示。
          </li>
          <li>
            採択は確認できたが金額が未公表の案件は「金額不明」として保持し、
            件数ベースの集計にのみ含める（金額ランキング・合計には影響しない）。
            円は参考レート 1USD=150円 で換算。
          </li>
        </ul>
      </details>
      <GrantsExplorer grants={grants} />
    </div>
  );
}
