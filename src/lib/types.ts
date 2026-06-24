export type Country = "US" | "JP";

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
  amountUsd: number;
  fiscalYear: number;
  awardDate: string;
  description: string;
  sourceUrl: string;
}
