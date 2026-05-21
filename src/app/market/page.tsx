import { getTopCoins } from "@/lib/coingecko";
import CoinTable from "@/components/CoinTable";
import GainersLosers from "@/components/GainersLosers";

export const metadata = { title: "Market — Crypto Dashboard" };

export default async function MarketPage() {
  const coins = await getTopCoins(50);

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Рынок</h1>
        <p className="text-zinc-400 text-sm mt-1">Топ-50 по капитализации · обновляется каждые 60 сек</p>
      </div>
      <GainersLosers coins={coins} />
      <div className="bg-zinc-900 rounded-2xl border border-white/10 px-4 py-2">
        <CoinTable coins={coins} />
      </div>
    </main>
  );
}
