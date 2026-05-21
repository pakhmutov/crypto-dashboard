import Image from "next/image";
import Link from "next/link";
import type { Coin } from "@/types/coin";

function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1 ? 2 : 6,
  }).format(n);
}

interface Props {
  coins: Coin[];
}

function CoinRow({ coin, isGainer }: { coin: Coin; isGainer: boolean }) {
  const change = coin.price_change_percentage_24h;
  return (
    <Link
      href={`/coin/${coin.id}`}
      className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
    >
      <Image src={coin.image} alt={coin.name} width={24} height={24} className="rounded-full" />
      <div className="flex-1 min-w-0">
        <div className="text-white text-sm font-medium truncate">{coin.name}</div>
        <div className="text-zinc-500 text-xs font-mono">{fmtPrice(coin.current_price)}</div>
      </div>
      <span className={`text-sm font-mono font-medium ${isGainer ? "text-emerald-400" : "text-red-400"}`}>
        {isGainer ? "+" : ""}{change.toFixed(2)}%
      </span>
    </Link>
  );
}

export default function GainersLosers({ coins }: Props) {
  const sorted = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  const gainers = sorted.slice(0, 5);
  const losers = sorted.slice(-5).reverse();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3">
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wide px-3 mb-2">
          Топ роста 24ч
        </div>
        {gainers.map((coin) => (
          <CoinRow key={coin.id} coin={coin} isGainer={true} />
        ))}
      </div>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-3">
        <div className="text-xs font-medium text-zinc-400 uppercase tracking-wide px-3 mb-2">
          Топ падения 24ч
        </div>
        {losers.map((coin) => (
          <CoinRow key={coin.id} coin={coin} isGainer={false} />
        ))}
      </div>
    </div>
  );
}
