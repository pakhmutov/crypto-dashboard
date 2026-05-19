import Image from "next/image";
import Link from "next/link";
import { getCoinInfo, getCoinOHLC } from "@/lib/coingecko";
import PriceChart from "@/components/PriceChart";
import PriceTicker from "@/components/PriceTicker";

function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1 ? 2 : 6,
  }).format(n);
}

function fmtLarge(n: number) {
  const fmt = (v: number, d: number) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: d }).format(v);
  if (n >= 1e9) return `$${fmt(n / 1e9, 2)}B`;
  if (n >= 1e6) return `$${fmt(n / 1e6, 2)}M`;
  return fmtPrice(n);
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return { title: `${id} — Crypto Dashboard` };
}

export default async function CoinPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [coin, ohlc] = await Promise.all([getCoinInfo(id), getCoinOHLC(id, 7)]);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <Link href="/market" className="text-sm text-zinc-400 hover:text-white transition-colors mb-6 inline-flex items-center gap-1">
        ← Рынок
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-4 mb-8">
        <Image src={coin.image} alt={coin.name} width={48} height={48} className="rounded-full" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">{coin.name}</h1>
            <span className="text-zinc-500 uppercase text-sm">{coin.symbol}</span>
          </div>
          <PriceTicker
            symbol={coin.symbol}
            initialPrice={coin.current_price}
            initialChange={coin.price_change_percentage_24h}
          />
        </div>
      </div>

      <PriceChart coinId={id} initialData={ohlc} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {[
          { label: "Капитализация", value: fmtLarge(coin.market_cap) },
          { label: "Объём 24ч", value: fmtLarge(coin.total_volume) },
          { label: "Макс. 24ч", value: fmtPrice(coin.high_24h) },
          { label: "Мин. 24ч", value: fmtPrice(coin.low_24h) },
        ].map(({ label, value }) => (
          <div key={label} className="bg-zinc-900 border border-white/10 rounded-xl p-4">
            <div className="text-zinc-400 text-xs mb-1">{label}</div>
            <div className="text-white font-mono text-sm font-medium">{value}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
