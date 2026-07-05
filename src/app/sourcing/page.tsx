import { grants } from "@/data/grants";
import SourcingView from "@/components/SourcingView";

export const metadata = {
  title: "ソーシング（スタートアップ動向） | Space & Defense Grants Dashboard",
};

export default function SourcingPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">
          ソーシング — どのスタートアップが政府資金を獲得しているか
        </h1>
        <p className="text-sm text-slate-300">
          企業区分（スタートアップ / 大手）で絞り込み、直近の資金獲得の動きを時系列で追えます。
          各案件は出典リンクで一次情報に辿れます。
        </p>
      </div>
      <SourcingView grants={grants} />
    </div>
  );
}
