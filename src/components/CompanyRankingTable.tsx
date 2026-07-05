"use client";

import { useState } from "react";
import { Grant } from "@/lib/types";
import { CompanyAgg, formatOriginal, formatUsd } from "@/lib/aggregate";

export default function CompanyRankingTable({
  ranking,
  grants,
}: {
  ranking: CompanyAgg[];
  grants: Grant[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-white/10 text-left text-slate-400">
          <th className="py-2 font-medium">#</th>
          <th className="py-2 font-medium">企業名</th>
          <th className="py-2 font-medium">国</th>
          <th className="py-2 text-right font-medium">獲得金額</th>
          <th className="py-2 text-right font-medium">件数</th>
          <th className="py-2"></th>
        </tr>
      </thead>
      <tbody>
        {ranking.map((c, i) => {
          const key = `${c.company}__${c.country}`;
          const isOpen = open === key;
          const awards = grants
            .filter((g) => g.company === c.company && g.country === c.country)
            .sort((a, b) => b.amountUsd - a.amountUsd);
          return (
            <ContractRows
              key={key}
              rank={i + 1}
              agg={c}
              awards={awards}
              isOpen={isOpen}
              onToggle={() => setOpen(isOpen ? null : key)}
            />
          );
        })}
      </tbody>
    </table>
  );
}

function ContractRows({
  rank,
  agg,
  awards,
  isOpen,
  onToggle,
}: {
  rank: number;
  agg: CompanyAgg;
  awards: Grant[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr
        className="cursor-pointer border-b border-white/5 transition-colors hover:bg-white/5"
        onClick={onToggle}
      >
        <td className="py-2 text-slate-400">{rank}</td>
        <td className="py-2 font-medium text-white">{agg.company}</td>
        <td className="py-2">
          <CountryBadge country={agg.country} />
        </td>
        <td className="py-2 text-right font-medium text-cyan-300">
          {formatUsd(agg.totalUsd)}
        </td>
        <td className="py-2 text-right text-slate-300">{agg.count}</td>
        <td className="py-2 text-right text-slate-400">{isOpen ? "▲" : "▼"}</td>
      </tr>
      {isOpen &&
        awards.map((g) => (
          <tr key={g.id} className="border-b border-white/5 bg-white/[0.02]">
            <td></td>
            <td className="py-2 pl-2" colSpan={2}>
              <div className="font-medium text-slate-200">{g.program}</div>
              <div className="text-xs text-slate-400">
                {g.agency} · {g.awardDate}
              </div>
            </td>
            <td className="py-2 text-right text-slate-200">
              {g.amountUnknown ? (
                <span className="text-slate-400">金額不明</span>
              ) : (
                formatUsd(g.amountUsd)
              )}
              {!g.amountUnknown && g.currency !== "USD" && (
                <div className="text-xs text-slate-400">
                  {formatOriginal(g.amountOriginal, g.currency)}
                </div>
              )}
            </td>
            <td></td>
            <td className="py-2 text-right">
              <a
                href={g.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-xs font-medium text-cyan-400 hover:underline"
              >
                出典 ↗
              </a>
            </td>
          </tr>
        ))}
    </>
  );
}

function CountryBadge({ country }: { country: Grant["country"] }) {
  return (
    <span
      className={
        country === "US"
          ? "rounded bg-blue-500/20 px-2 py-0.5 text-xs text-blue-200"
          : "rounded bg-rose-500/20 px-2 py-0.5 text-xs text-rose-200"
      }
    >
      {country === "US" ? "米国" : "日本"}
    </span>
  );
}
