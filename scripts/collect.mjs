// 宇宙・防衛関連の政府調達「契約」と「補助金(grant)」を、Web検索/クローリングで
// 定期収集する。
//   - 公式RSSフィード（SpaceNews, NASA, DoD Contracts 等）を巡回
//   - JAXA / 防衛省 などの公式お知らせページをHTMLスクレイピング
// 構造化APIへの直接問い合わせ（USAspending.gov / SBIR.gov 等）は使わず、
// 一般的なWebクロール手法（RSS取得・HTML解析）のみで収集する。
//
// GitHub Actions（.github/workflows/collect.yml）から週次で実行し、
// 結果を src/data/collected.json に書き出す。差分があれば Actions がコミットする。
//
// 注意: 一部のネットワーク環境では外部サイトへの接続が制限される。その場合は
// 既存の collected.json を保持して終了する（CIランナーでは外部接続可）。

import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import * as cheerio from "cheerio";
import Parser from "rss-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, "..", "src", "data", "collected.json");
const MAX_RECORDS = 200;
const UA = "Mozilla/5.0 (compatible; SpaceGrantsBot/1.0; +informational research crawler)";

const parser = new Parser({
  headers: { "User-Agent": UA },
  timeout: 20000,
});

const SPACE_DEFENSE_KEYWORDS =
  /space|satellite|launch|rocket|missile|hypersonic|lunar|moon|mars|orbital|spacecraft|defense contract|SDA|NSSL|NRO/i;

const THEME_RULES = [
  [/launch|rocket|booster/i, "ロケット・打上げ"],
  [/propuls|engine|thruster/i, "推進システム"],
  [/missile|interceptor|hypersonic/i, "ミサイル防衛"],
  [/satellite|imagery|earth observation|remote sensing|\bsar\b|衛星/i, "衛星・リモートセンシング"],
  [/space domain|situational|debris|tracking layer|missile warning|space surveillance|宇宙状況監視/i, "宇宙状況監視(SSA)"],
  [/lunar|moon|mars|deep space|exploration|planetary|月|探査/i, "月・深宇宙探査"],
  [/uav|unmanned|autonom|drone|無人機/i, "無人機・自律システム"],
  [/cyber|サイバー/i, "サイバー防衛"],
  [/command|control|\bc2\b|artificial intelligence|machine learning|AI|指揮統制/i, "AI・指揮統制"],
  [/satcom|communication|transport layer|data link|通信/i, "通信・データリンク"],
];

function classifyTheme(text = "") {
  for (const [re, theme] of THEME_RULES) if (re.test(text)) return theme;
  return "衛星・リモートセンシング";
}

// 本文中の金額表記（$1.2 billion / $450 million / $3,200,000 など）を抽出してUSDに変換
function extractAmountUsd(text = "") {
  const billion = text.match(/\$\s?([\d.]+)\s?billion/i);
  if (billion) return Math.round(parseFloat(billion[1]) * 1_000_000_000);
  const million = text.match(/\$\s?([\d.]+)\s?million/i);
  if (million) return Math.round(parseFloat(million[1]) * 1_000_000);
  const raw = text.match(/\$\s?([\d,]{7,})/);
  if (raw) return Number(raw[1].replace(/,/g, ""));
  return 0;
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

// ---- RSSフィード巡回（SpaceNews, NASA, DoD Contracts） ----
const RSS_FEEDS = [
  { url: "https://spacenews.com/feed/", agency: "SpaceNews (報道)", country: "US" },
  { url: "https://www.nasa.gov/news-release/feed/", agency: "NASA", country: "US" },
  { url: "https://www.defense.gov/News/Contracts/feed/", agency: "U.S. Department of Defense", country: "US" },
];

async function fetchRss({ url, agency, country }) {
  const feed = await parser.parseURL(url);
  const items = [];
  for (const entry of feed.items ?? []) {
    const title = entry.title || "";
    const content = entry.contentSnippet || entry.content || entry.summary || "";
    const text = `${title} ${content}`;
    if (!SPACE_DEFENSE_KEYWORDS.test(text)) continue;
    const amountUsd = extractAmountUsd(text);
    if (amountUsd <= 0) continue;
    const date = entry.isoDate || entry.pubDate || "";
    const companyMatch = title.match(/^([A-Z][\w&.,'\- ]{2,40}?)\s+(?:awarded|wins|to|receives)/i);
    items.push({
      id: `auto-rss-${hash(entry.link || title)}`,
      company: companyMatch ? companyMatch[1].trim() : "(詳細は出典参照)",
      country,
      agency,
      program: title.slice(0, 120),
      theme: classifyTheme(text),
      amountUsd,
      amountOriginal: amountUsd,
      currency: "USD",
      fiscalYear: date ? new Date(date).getFullYear() : new Date().getFullYear(),
      awardDate: date ? new Date(date).toISOString().slice(0, 10) : "",
      description: content.slice(0, 140),
      sourceUrl: entry.link || url,
      auto: true,
    });
  }
  return items;
}

// 本文中の円建て金額（「約212億円」「25億円」等）を抽出
function extractAmountJpy(text = "") {
  const cho = text.match(/([\d.,]+)\s*兆円/);
  if (cho) return Math.round(parseFloat(cho[1].replace(/,/g, "")) * 1_000_000_000_000);
  const oku = text.match(/([\d.,]+)\s*億円/);
  if (oku) return Math.round(parseFloat(oku[1].replace(/,/g, "")) * 100_000_000);
  return 0;
}

// ---- 日本の公式お知らせページ（HTMLスクレイピング） ----
// 採択・契約に関するリンクを抽出。金額がページ上で判明しない場合は
// amountUnknown: true で保持する（件数ベースの集計・ソーシング用途に使用）。
const JP_PAGES = [
  { url: "https://www.jaxa.jp/press/index_j.html", agency: "JAXA" },
  { url: "https://fund.jaxa.jp/topics/", agency: "JAXA（宇宙戦略基金）" },
  { url: "https://www.mod.go.jp/j/press/news/index.html", agency: "防衛省" },
  { url: "https://www.mext.go.jp/b_menu/houdou/index.htm", agency: "文部科学省" },
];

async function fetchJpPage({ url, agency }) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`${agency}: HTTP ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);
  const items = [];
  $("a").each((_, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr("href");
    if (!title || !href) return;
    if (!/採択|選定|契約|委託|交付|補助|基金|公募.*結果/.test(title)) return;
    if (!/宇宙|衛星|ロケット|ミサイル|デブリ|月面|探査|打上げ|SAR|コンステ/.test(title)) return;
    let link;
    try {
      link = href.startsWith("http") ? href : new URL(href, url).toString();
    } catch {
      return;
    }
    const amountJpy = extractAmountJpy(title);
    items.push({
      id: `auto-jp-${hash(link || title)}`,
      company: "(詳細は出典参照)",
      country: "JP",
      agency,
      program: title.slice(0, 120),
      theme: classifyTheme(title),
      amountUsd: amountJpy > 0 ? Math.round(amountJpy / 150) : 0,
      amountOriginal: amountJpy,
      currency: "JPY",
      fiscalYear: new Date().getFullYear(),
      awardDate: "",
      description: title.slice(0, 140),
      sourceUrl: link,
      auto: true,
      ...(amountJpy === 0 ? { amountUnknown: true } : {}),
    });
  });
  return items;
}

async function main() {
  const collected = [];

  for (const feed of RSS_FEEDS) {
    try {
      const rows = await fetchRss(feed);
      collected.push(...rows);
      console.log(`RSS ${feed.url}: ${rows.length}`);
    } catch (e) {
      console.error(`skip ${feed.url}: ${e.message}`);
    }
  }

  for (const page of JP_PAGES) {
    try {
      const rows = await fetchJpPage(page);
      collected.push(...rows);
      console.log(`JP ${page.agency}: ${rows.length}`);
    } catch (e) {
      console.error(`skip ${page.agency}: ${e.message}`);
    }
  }

  const MIN_AMOUNT = 2_000_000;
  const MAX_UNKNOWN = 50; // 金額不明の採択情報は最新50件まで保持
  const withAmount = collected.filter((g) => !g.amountUnknown && g.amountUsd >= MIN_AMOUNT);
  const unknown = collected.filter((g) => g.amountUnknown).slice(0, MAX_UNKNOWN);
  const usable = [...withAmount, ...unknown];
  if (usable.length === 0) {
    console.error("No data collected (network restricted, or no qualifying items this run). Keeping existing file.");
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
