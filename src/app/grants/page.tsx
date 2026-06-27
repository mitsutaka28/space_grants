import { grants } from "@/data/grants";
import GrantsExplorer from "@/components/GrantsExplorer";

export default function GrantsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold">案件一覧・検索</h1>
        <p className="text-sm text-zinc-500">
          米国・日本の宇宙・防衛関連の実在の契約・調達案件を検索・フィルタできます。各案件は出典リンクで検証可能です。
        </p>
      </div>
      <GrantsExplorer grants={grants} />
    </div>
  );
}
