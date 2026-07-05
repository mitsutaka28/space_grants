import { NewsItem } from "@/lib/types";

// 実在の公募・採択ニュース。日付は発表日（一部は概ねの時期）。詳細・正確な締切は各 sourceUrl を参照。
export const news: NewsItem[] = [
  {
    id: "n-ssc-andromeda",
    type: "採択",
    country: "US",
    title: "米宇宙軍、宇宙領域把握「Andromeda」で14社に総額$1.84Bを発注",
    agency: "U.S. Space Force (SSC)",
    date: "2026-04-01",
    summary:
      "軌道上脅威追跡を拡大する10年IDIQ（上限$6.24B）。True Anomaly・Astranis・Anduril等の新興勢とLockheed Martin・Northrop Grumman等の大手が混在して選定。",
    sourceUrl:
      "https://www.militaryaerospace.com/communications/article/55369846/space-systems-command-awards-18-billion-andromeda-contracts-for-space-based-sda",
  },
  {
    id: "n-ssc-sbi",
    type: "採択",
    country: "US",
    title: "米宇宙軍、宇宙配備型迎撃体（SBI）関連で12社に総額$3.2Bを発注",
    agency: "U.S. Space Force (SSC)",
    date: "2026-04-26",
    summary:
      "Golden Dome構想に向けた宇宙配備型迎撃体の開発で、Anduril・True Anomaly・SpaceX等を含む12社が計20件のOTA契約を獲得。",
    sourceUrl:
      "https://www.satellitetoday.com/government-military/2026/04/26/space-force-awards-3-2-billion-to-12-companies-for-space-based-interceptor-work/",
  },
  {
    id: "n-sda-t3tl",
    type: "採択",
    country: "US",
    title: "SDA、Tranche 3 Tracking Layer 72機を4社に総額$3.5Bで発注",
    agency: "Space Development Agency",
    date: "2025-12-19",
    summary:
      "ミサイル警戒・追尾衛星72機をLockheed Martin($1.1B)・L3Harris($843M)・Rocket Lab($816M)・Northrop Grumman($764M)に発注。FY2029打上げ予定。",
    sourceUrl:
      "https://www.sda.mil/space-development-agency-makes-awards-to-build-72-tracking-layer-satellites-for-tranche-3/",
  },
  {
    id: "n-stratfi-2025",
    type: "採択",
    country: "US",
    title: "SpaceWERX、STRATFI 2025で8社（総額$440M）を選定",
    agency: "U.S. Space Force (SpaceWERX)",
    date: "2025-03-08",
    summary:
      "Albedo・Beast Code・CesiumAstro・Gravitics・LeoLabs・Rise8・Umbra・Xonaの8社を選定。1社最大$60M（政府+民間マッチング）で、スタートアップの防衛宇宙参入の主要ルート。",
    sourceUrl:
      "https://spacenews.com/spacewerx-selects-eight-companies-for-440-million-in-public-private-partnerships/",
  },
  {
    id: "n-fund-phase1-done",
    type: "採択",
    country: "JP",
    title: "宇宙戦略基金 第1期（3,000億円）の採択が出揃う — スタートアップ16社に388億円",
    agency: "JAXA（宇宙戦略基金）",
    date: "2025-02-28",
    summary:
      "第1期の採択結果が完了。スタートアップ16社に計388億円が配分され、輸送・衛星・探査の各分野で民間主導の開発が本格化。",
    sourceUrl: "https://sorabatake.jp/39799/",
  },
  {
    id: "n-fund-phase2-109",
    type: "採択",
    country: "JP",
    title: "宇宙戦略基金 第2期、21テーマ・109件の採択が進行（2026年3月時点）",
    agency: "JAXA（宇宙戦略基金）",
    date: "2026-03-31",
    summary:
      "総額3,000億円・24テーマの第2期はNEC・三菱電機などの大手からアストロスケール・ispace等のスタートアップまで幅広く採択。非宇宙プレイヤーの参入促進を重視。",
    sourceUrl: "https://fund.jaxa.jp/techlist/",
  },
  {
    id: "n-fund-axelspace",
    type: "採択",
    country: "JP",
    title: "アクセルスペース、宇宙戦略基金「次世代地球観測衛星に向けた観測機能高度化技術」に採択",
    agency: "JAXA（宇宙戦略基金）",
    date: "2026-03-23",
    summary:
      "連携機関3社とともに次世代地球観測衛星の観測機能高度化技術の開発に採択。衛星データ利用システム実装加速化事業（RESTEC代表、Synspective等参画）にも別途採択。",
    sourceUrl: "https://www.businesswire.com/news/home/20260323261716/ja",
  },
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
