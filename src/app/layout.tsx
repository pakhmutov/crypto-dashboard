import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Crypto Dashboard",
  description: "Персональный дашборд для отслеживания крипто-рынка и портфеля",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full bg-zinc-950 text-white antialiased">
        <nav className="border-b border-white/10 bg-zinc-950/80 backdrop-blur sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/market" className="font-bold text-lg tracking-tight">
              Crypto<span className="text-violet-400">DB</span>
            </Link>
            <div className="flex items-center gap-1">
              <Link href="/market" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                Рынок
              </Link>
              <Link href="/portfolio" className="px-3 py-1.5 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
                Портфель
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
