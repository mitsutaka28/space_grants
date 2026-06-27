export type Country = "US" | "JP";

export type Currency = "USD" | "JPY";

export type Theme =
  | "衛星・リモートセンシング"
  | "ロケット・打上げ"
  | "推進システム"
  | "宇宙状況監視(SSA)"
  | "ミサイル防衛"
  | "無人機・自律システム"
  | "サイバー防衛"
  | "AI・指揮統制"
  | "月・深宇宙探査"
  | "通信・データリンク";

export interface Grant {
  id: string;
  company: string;
  country: Country;
  agency: string;
  program: string;
  theme: Theme;
  /** 米ドル換算額（集計・比較用の基準値）。日本円は JPY_PER_USD で換算。 */
  amountUsd: number;
  /** 公表された原通貨での金額 */
  amountOriginal: number;
  currency: Currency;
  fiscalYear: number;
  awardDate: string;
  description: string;
  /** 一次情報・報道など検証可能な出典URL */
  sourceUrl: string;
}

/** 円→ドル換算に用いる参考レート（表示用）。 */
export const JPY_PER_USD = 150;
