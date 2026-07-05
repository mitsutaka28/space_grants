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

/** ソーシング観点での企業区分 */
export type OrgType = "スタートアップ" | "大手・既存" | "コンソーシアム等";

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
  /** 自動収集（RSS/クローリング）由来の場合 true。手動キュレーションは未設定。 */
  auto?: boolean;
  /** 企業区分（スタートアップ・大手など）。ソーシング用のフィルタに使用。 */
  orgType?: OrgType;
  /**
   * 採択は確認できたが金額が未公表・不明の場合 true。
   * amountUsd は 0 とし、金額ランキング・合計には影響させず件数ベースの集計にのみ含める。
   */
  amountUnknown?: boolean;
}

/** 円→ドル換算に用いる参考レート（表示用）。 */
export const JPY_PER_USD = 150;

export type NewsType = "公募" | "採択";

export interface NewsItem {
  id: string;
  /** 公募 = 新規の公募・募集、採択 = 採択・契約の決定 */
  type: NewsType;
  country: Country;
  title: string;
  agency: string;
  /** 発表日。一部は概ねの時期（詳細は sourceUrl を参照）。 */
  date: string;
  summary: string;
  sourceUrl: string;
  /** 公募の場合の応募締切（判明分のみ） */
  deadline?: string;
  /** 現在募集中（応募受付中）の公募の場合 true */
  open?: boolean;
}
