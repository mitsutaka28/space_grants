import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Space & Defense Grants Dashboard",
  description: "米国・日本の宇宙・防衛関連の補助金・政府調達情報ダッシュボード",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-100">
        <header className="glass sticky top-0 z-10 border-x-0 border-t-0">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <a href="/" className="text-lg font-semibold tracking-tight text-white">
              🛰️ Space &amp; Defense Grants Dashboard
            </a>
            <nav className="flex gap-6 text-sm font-medium text-slate-300">
              <a href="/" className="transition-colors hover:text-cyan-300">
                概要
              </a>
              <a href="/grants" className="transition-colors hover:text-cyan-300">
                一覧・検索
              </a>
              <a href="/news" className="transition-colors hover:text-cyan-300">
                公募・採択ニュース
              </a>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="glass border-x-0 border-b-0 py-4 text-center text-xs text-slate-400">
          公式発表・報道に基づく実在の契約データ（各案件に出典リンクあり）。日本円は参考レート 1USD=150円 で換算。
        </footer>
      </body>
    </html>
  );
}
