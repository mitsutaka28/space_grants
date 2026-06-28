// 宇宙・防衛関連の政府調達を USAspending.gov の公開API（認証不要）から定期収集する。
// GitHub Actions（.github/workflows/collect.yml）から週次で実行され、
// 結果を src/data/collected.json に書き出す。差分があれば Actions がコミットする。
//
// 注意: 一部のネットワーク環境では api.usaspending.gov への接続が制限される。
// その場合スクリプトは既存の collected.json を保持して終了する（CIでは外部接続可）。

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "data", "collected.json");
const API = "https://api.usaspending.gov/api/v2/search/spending_by_award/";

const THEME_RULES = [
  [/launch|rocket|booster/i, "ロケット・打上げ"],
  [/propuls|engine/i, "推進システム"],
  [/missile|interceptor|hypersonic/i, "ミサイル防衛"],
  [/satellite|imagery|earth observation|remote sensing|sar/i, "衛星・リモートセンシング"],
  [/space domain|space situational|debris|tracking layer|missile warning/i, "宇宙状況監視(SSA)"],
  [/lunar|moon|mars|deep space|exploration/i, "月・深宇宙探査"],
  [/uav|unmanned|autonom|drone/i, "無人機・自律システム"],
  [/cyber/i, "サイバー防衛"],
  [/command|control|c2|artificial intelligence|data/i, "AI・指揮統制"],
  [/satcom|communication|transport layer|data link/i, "通信・データリンク"],
];

function classifyTheme(text = "") {
  for (const [re, theme] of THEME_RULES) if (re.test(text)) return theme;
  return "衛星・リモートセンシング";
}

async function fetchAgency(agencyName, keywords) {
  const body = {
    filters: {
      keywords,
      award_type_codes: ["A", "B", "C", "D"],
      time_period: [{ start_date: "2022-01-01", end_date: "2030-12-31" }],
      agencies: [{ type: "awarding", tier: "toptier", name: agencyName }],
    },
    fields: [
      "Award ID",
      "Recipient Name",
      "Award Amount",
      "Awarding Agency",
      "Description",
      "Start Date",
      "generated_internal_id",
    ],
    limit: 25,
    page: 1,
    sort: "Award Amount",
    order: "desc",
  };
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${agencyName}: HTTP ${res.status}`);
  const json = await res.json();
  return json.results ?? [];
}

function toGrant(r) {
  const amount = Number(r["Award Amount"]) || 0;
  const desc = r["Description"] || "";
  const date = r["Start Date"] || "";
  const year = date ? Number(String(date).slice(0, 4)) : new Date().getFullYear();
  return {
    id: `auto-${r["generated_internal_id"] || r["Award ID"]}`,
    company: r["Recipient Name"] || "(不明)",
    country: "US",
    agency: r["Awarding Agency"] || "",
    program: r["Award ID"] || "",
    theme: classifyTheme(`${desc} ${r["Award ID"] || ""}`),
    amountUsd: amount,
    amountOriginal: amount,
    currency: "USD",
    fiscalYear: year,
    awardDate: date,
    description: desc.slice(0, 140),
    sourceUrl: `https://www.usaspending.gov/award/${r["generated_internal_id"] || ""}`,
    auto: true,
  };
}

async function main() {
  const jobs = [
    ["National Aeronautics and Space Administration", ["space", "satellite", "launch", "lunar"]],
    ["Department of Defense", ["space", "satellite", "missile", "launch", "hypersonic"]],
  ];

  const collected = [];
  for (const [agency, keywords] of jobs) {
    try {
      const rows = await fetchAgency(agency, keywords);
      for (const r of rows) {
        const g = toGrant(r);
        if (g.amountUsd >= 5_000_000) collected.push(g);
      }
      console.log(`fetched ${rows.length} from ${agency}`);
    } catch (e) {
      console.error(`skip ${agency}: ${e.message}`);
    }
  }

  if (collected.length === 0) {
    console.error("No data collected (network restricted?). Keeping existing file.");
    if (!existsSync(OUT)) writeFileSync(OUT, "[]\n");
    return;
  }

  // id 重複排除し金額降順で上位50件
  const byId = new Map();
  for (const g of collected) if (!byId.has(g.id)) byId.set(g.id, g);
  const out = [...byId.values()].sort((a, b) => b.amountUsd - a.amountUsd).slice(0, 50);

  const prev = existsSync(OUT) ? readFileSync(OUT, "utf8") : "";
  const next = JSON.stringify(out, null, 2) + "\n";
  if (prev.trim() === next.trim()) {
    console.log("No changes.");
    return;
  }
  writeFileSync(OUT, next);
  console.log(`Wrote ${out.length} records to collected.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(0); // CI を失敗させない（収集はベストエフォート）
});
