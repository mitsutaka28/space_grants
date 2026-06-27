import { NewsItem } from "@/lib/types";

// 実在の公募・採択ニュース。日付は発表日（一部は概ねの時期）。詳細・正確な締切は各 sourceUrl を参照。
export const news: NewsItem[] = [
  {
    id: "n-mod-trisat",
    type: "採択",
    country: "JP",
    title: "防衛省、衛星コンステレーション整備・運営事業者に「トライサット」を選定",
    agency: "防衛省",
    date: "2026-02-19",
    summary:
      "スタンド・オフ防衛用の画像情報取得を担う衛星群の整備・運営事業（PFI）の事業者として、三菱電機・スカパーJSAT・三井物産ほか7社による「トライサット・コンステレーション」を選定。総額約2,831億円。",
    sourceUrl: "https://www.mod.go.jp/j/press/news/2025/12/24a.html",
  },
  {
    id: "n-mod-type12",
    type: "採択",
    country: "JP",
    title: "防衛省、三菱重工と長射程スタンド・オフ・ミサイルの量産契約を締結",
    agency: "防衛省",
    date: "2025-10-06",
    summary:
      "12式地対艦誘導弾能力向上型（艦艇発射型、約250億円）および潜水艦発射型誘導弾（約29億円）の量産契約を三菱重工業と締結。",
    sourceUrl: "https://www.nikkei.com/article/DGXZQOUA07BBW0X01C25A0000000/",
  },
  {
    id: "n-spacewerx-opentopic",
    type: "公募",
    country: "US",
    title: "AFWERX/SpaceWERX、SBIR再認可を受け新規SBIR/STTR公募を開始",
    agency: "SpaceWERX / AFWERX",
    date: "2025",
    summary:
      "SBIR/STTRプログラムのFY2031までの再認可を受け、新たなSBIR/STTR公募を開始。Phase I および Direct-to-Phase II のオープントピックを提供。FY2025のAFWERX契約は1,000件超・総額$1.37B。",
    sourceUrl:
      "https://www.afrl.af.mil/News/Article-Display/Article/4473004/afwerx-spacewerx-open-new-sbirsttr-solicitations-following-reauthorization/",
  },
  {
    id: "n-jaxa-fund-3themes",
    type: "公募",
    country: "JP",
    title: "JAXA宇宙戦略基金（第2期）、3テーマの公募を開始",
    agency: "JAXA",
    date: "2025-07",
    summary:
      "総額3,000億円・24テーマの第2期のうち、衛星・輸送・探査等の技術開発テーマについて段階的に公募を開始。",
    sourceUrl:
      "https://fund.jaxa.jp/topics/%EF%BC%88%E7%AC%AC%E4%BA%8C%E6%9C%9F%EF%BC%893%E3%83%86%E3%83%BC%E3%83%9E%E3%81%AE%E5%85%AC%E5%8B%9F%E3%82%92%E9%96%8B%E5%A7%8B%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F/",
  },
  {
    id: "n-jaxa-fund-schedule",
    type: "公募",
    country: "JP",
    title: "JAXA宇宙戦略基金（第2期）の公募予定を公開",
    agency: "JAXA",
    date: "2025-04-18",
    summary:
      "第2期技術開発テーマの公募スケジュール（発出時期・対象分野）を公開。複数回に分けて順次公募を実施。",
    sourceUrl: "https://fund.jaxa.jp/",
  },
  {
    id: "n-meti-fund-phase2",
    type: "公募",
    country: "JP",
    title: "経済産業省、宇宙戦略基金（第二期）の技術開発テーマを策定",
    agency: "経済産業省",
    date: "2025-03-26",
    summary:
      "宇宙戦略基金基本方針の改定と併せ、経産省計上分の第二期技術開発テーマを策定。FY2024補正の1,000億円を新規テーマに配分。",
    sourceUrl: "https://www.meti.go.jp/press/2024/03/20250326004/20250326004.html",
  },
  {
    id: "n-nssl-lane2",
    type: "採択",
    country: "US",
    title: "米宇宙軍、NSSL Phase 3 Lane 2で総額$13.7Bを3社に発注",
    agency: "U.S. Space Force (SSC)",
    date: "2025-04-04",
    summary:
      "安全保障打上げの最難関ミッションを担うLane 2で、SpaceX（$5.92B）・ULA（$5.37B）・Blue Origin（$2.39B）を選定。FY25から5年間で54ミッションを発注予定。",
    sourceUrl:
      "https://www.spaceforce.mil/News/Article-Display/Article/4146459/space-systems-command-awards-national-security-space-launch-phase-3-lane-2-cont/",
  },
  {
    id: "n-astroscale-crd2",
    type: "採択",
    country: "JP",
    title: "アストロスケール、JAXA商業デブリ除去実証（CRD2）フェーズIIを受注",
    agency: "JAXA",
    date: "2024-08-20",
    summary:
      "大型デブリの捕獲・除去を実証する衛星ADRAS-J2の開発・運用を約132億円で受注。2027年度の打上げを予定。",
    sourceUrl:
      "https://astroscale.com/ja/astroscale-japan-secures-contract-for-phase-ii-of-jaxas-commercial-removal-of-debris-demonstration-program/",
  },
  {
    id: "n-mda-ngi",
    type: "採択",
    country: "US",
    title: "ミサイル防衛局、次世代迎撃ミサイル(NGI)をLockheed Martinに発注",
    agency: "Missile Defense Agency",
    date: "2024-04-15",
    summary:
      "地上配備型ミッドコース防衛(GMD)の近代化に向け、次世代迎撃ミサイルの単独開発契約（約$17B）をLockheed Martinが獲得。",
    sourceUrl:
      "https://breakingdefense.com/2024/04/lockheed-wins-competition-to-build-next-gen-interceptor/",
  },
];
