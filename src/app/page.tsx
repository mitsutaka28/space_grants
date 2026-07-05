import { grants } from "@/data/grants";
import { news } from "@/data/news";
import DashboardView from "@/components/DashboardView";

export default function Home() {
  const openCalls = news.filter((n) => n.type === "公募" && n.open);

  return (
    <div className="mx-auto max-w-6xl px-6 py-8 space-y-8">
      {openCalls.length > 0 && (
        <section className="glass rounded-2xl border-emerald-400/30 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-emerald-200">
              🟢 現在募集中の公募（{openCalls.length}件）
            </h2>
            <a href="/news" className="text-xs text-cyan-400 hover:underline">
              すべてのニュースを見る →
            </a>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {openCalls.map((n) => (
              <li key={n.id} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                <div className="mb-1 flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className={
                      n.country === "US"
                        ? "rounded bg-blue-500/20 px-1.5 py-0.5 text-blue-200"
                        : "rounded bg-rose-500/20 px-1.5 py-0.5 text-rose-200"
                    }
                  >
                    {n.country === "US" ? "米国" : "日本"}
                  </span>
                  <span className="text-slate-300">{n.agency}</span>
                  {n.deadline && (
                    <span className="font-medium text-rose-300">締切: {n.deadline}</span>
                  )}
                </div>
                <a
                  href={n.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-white hover:text-cyan-300"
                >
                  {n.title} ↗
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      <DashboardView grants={grants} />
    </div>
  );
}
