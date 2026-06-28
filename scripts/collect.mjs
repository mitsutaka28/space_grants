// 宇宙・防衛関連の政府調達「契約」と「補助金(grant)」を、公開API（認証不要）から
// 網羅的に定期収集する。
//   - USAspending.gov : 連邦の契約(A-D)と補助金(02-05)を複数省庁から取得
//   - SBIR.gov        : SBIR/STTR の交付（中小企業向け補助金）を取得
// GitHub Actions（.github/workflows/collect.yml）から週次で実行し、
// 結果を src/data/collected.json に書き出す。差分があれば Actions がコミットする。
//
// 注意: 一部のネットワーク環境では外部APIへの接続が制限される。その場合は
// 既存の collected.json を保持して終了する（CIランナーでは外部接続可）。

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "data", "collected.json");
const USA_API = "https://api.usaspending.gov/api/v2/search/spending_by_award/";
const SBIR_API = "https://api.www.sbir.gov/public/api/awards";

const MIN_AMOUNT = 2_000_000; // ノイズ除去のしきい値（補助金は契約より小さいため低め）
const MAX_RECORDS = 200;

const THEME_RULES = [
  [/launch|rocket|booster/i, "ロケット・打上げ"],
  [/propuls|engine|thruster/i, "推進システム"],
  [/missile|interceptor|hypersonic/i, "ミサイル防衛"],
  [/satellite|imagery|earth observation|remote sensing|\bsar\b/i, "衛星・リモートセンシング"],
  [/space domain|situational|debris|tracking layer|missile warning|space surveillance/i, "宇宙状況監視(SSA)"],
  [/lunar|moon|mars|deep space|exploration|planetary/i, "月・深宇宙探査"],
  [/uav|unmanned|autonom|drone/i, "無人機・自律システム"],
  [/cyber/i, "サイバー防衛"],
  [/command|control|\bc2\b|artificial intelligence|machine learning/i, "AI・指揮統制"],
  [/satcom|communication|transport layer|data link/i, "通信・データリンク"],
];

function classifyTheme(text = "") {
  for (const [re, theme] of THEME_RULES) if (re.test(text)) return theme;
  return "衛星・リモートセンシング";
}

// ---- USAspending（契約・補助金） ----
async function fetchUsa(agencyName, keywords, kind) {
  // kind: "contract" | "grant"
  const award_type_codes =
    kind === "grant" ? ["02", "03", "04", "05"] : ["A", "B", "C", "D"];
  const body = {
    filters: {
      keywords,
      award_type_codes,
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
    limit: 50,
    page: 1,
    sort: "Award Amount",
    order: "desc",
  };
  const res = await fetch(USA_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`USA ${agencyName}/${kind}: HTTP ${res.status}`);
  const json = await res.json();
  return (json.results ?? []).map((r) => {
    const amount = Number(r["Award Amount"]) || 0;
    const desc = r["Description"] || "";
    const date = r["Start Date"] || "";
    return {
      id: `auto-usa-${r["generated_internal_id"] || r["Award ID"]}`,
      company: r["Recipient Name"] || "(不明)",
      country: "US",
      agency: r["Awarding Agency"] || agencyName,
      program: `${kind === "grant" ? "[補助金] " : ""}${r["Award ID"] || ""}`.trim(),
      theme: classifyTheme(`${desc} ${r["Award ID"] || ""}`),
      amountUsd: amount,
      amountOriginal: amount,
      currency: "USD",
      fiscalYear: date ? Number(String(date).slice(0, 4)) : new Date().getFullYear(),
      awardDate: date,
      description: desc.slice(0, 140),
      sourceUrl: `https://www.usaspending.gov/award/${r["generated_internal_id"] || ""}`,
      auto: true,
    };
  });
}

// ---- SBIR.gov（SBIR/STTR 交付＝中小企業向け補助金） ----
async function fetchSbir(agency, keyword) {
  const url = `${SBIR_API}?agency=${encodeURIComponent(agency)}&keyword=${encodeURIComponent(
    keyword
  )}&rows=50&start=0`;
  const res = await fetch(url, { headers: { Accept: "application/json" } });
  if (!res.ok) throw new Error(`SBIR ${agency}/${keyword}: HTTP ${res.status}`);
  const rows = await res.json();
  return (Array.isArray(rows) ? rows : []).map((r) => {
    const amount = Number(r.award_amount) || 0;
    const date = r.proposal_award_date || r.award_year || "";
    const title = r.award_title || "";
    return {
      id: `auto-sbir-${r.contract || r.agency_tracking_number || `${r.firm}-${title}`}`,
      company: r.firm || "(不明)",
      country: "US",
      agency: `${r.agency || ""}${r.branch ? " / " + r.branch : ""} (SBIR/STTR)`,
      program: `[補助金] ${title}`.slice(0, 120),
      theme: classifyTheme(`${title} ${r.abstract || ""}`),
      amountUsd: amount,
      amountOriginal: amount,
      currency: "USD",
      fiscalYear: Number(String(date).slice(0, 4)) || new Date().getFullYear(),
      awardDate: typeof date === "string" ? date : "",
      description: (r.abstract || title).slice(0, 140),
      sourceUrl: r.award_link || "https://www.sbir.gov/",
      auto: true,
    };
  });
}

async function main() {
  const collected = [];

  const usaJobs = [
    ["National Aeronautics and Space Administration", ["space", "satellite", "launch", "lunar"]],
    ["Department of Defense", ["space", "satellite", "missile", "launch", "hypersonic"]],
    ["National Science Foundation", ["space", "satellite", "astronomy"]],
    ["Department of Energy", ["space", "satellite"]],
  ];
  for (const [agency, kw] of usaJobs) {
    for (const kind of ["contract", "grant"]) {
      try {
        const rows = await fetchUsa(agency, kw, kind);
        collected.push(...rows);
        console.log(`USAspending ${agency}/${kind}: ${rows.length}`);
      } catch (e) {
        console.error(`skip ${e.message}`);
      }
    }
  }

  const sbirJobs = [
    ["DOD", "space"],
    ["DOD", "satellite"],
    ["NASA", "space"],
  ];
  for (const [agency, kw] of sbirJobs) {
    try {
      const rows = await fetchSbir(agency, kw);
      collected.push(...rows);
      console.log(`SBIR ${agency}/${kw}: ${rows.length}`);
    } catch (e) {
      console.error(`skip ${e.message}`);
    }
  }

  const usable = collected.filter((g) => g.amountUsd >= MIN_AMOUNT);
  if (usable.length === 0) {
    console.error("No data collected (network restricted?). Keeping existing file.");
    if (!existsSync(OUT)) writeFileSync(OUT, "[]\n");
    return;
  }

  const byId = new Map();
  for (const g of usable) if (!byId.has(g.id)) byId.set(g.id, g);
  const out = [...byId.values()]
    .sort((a, b) => b.amountUsd - a.amountUsd)
    .slice(0, MAX_RECORDS);

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
  process.exit(0); // 収集はベストエフォート（CIを失敗させない）
});
