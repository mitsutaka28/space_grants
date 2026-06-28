import { news } from "@/data/news";
import NewsFeed from "@/components/NewsFeed";

export default function NewsPage() {
  // 日付の降順（年のみ・年月の項目も自然に並ぶよう文字列比較）
  const sorted = [...news].sort((a, b) => (a.date < b.date ? 1 : -1));
  return (
    <div className="mx-auto max-w-4xl px-6 py-8 space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-white">公募・採択ニュース</h1>
        <p className="text-sm text-slate-300">
          米国・日本の宇宙・防衛分野の新しい公募と採択・契約の情報をまとめています。各項目は出典リンクで検証できます。
        </p>
      </div>
      <NewsFeed items={sorted} />
    </div>
  );
}
