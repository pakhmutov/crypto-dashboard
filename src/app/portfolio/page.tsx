"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { usePortfolioStore } from "@/store/portfolioStore";
import PortfolioCard from "@/components/PortfolioCard";
import type { Coin } from "@/types/coin";

export default function PortfolioPage() {
  const { items, addItem, removeItem } = usePortfolioStore();
  const [prices, setPrices] = useState<Coin[]>([]);
  const [allCoins, setAllCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null);
  const [amount, setAmount] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchPrices = useCallback(async () => {
    if (!items.length) return setPrices([]);
    const ids = items.map((i) => i.id).join(",");
    const res = await fetch(`/api/prices?ids=${ids}`);
    const data = await res.json();
    setPrices(data);
  }, [items]);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  useEffect(() => {
    fetch("/api/coins").then((r) => r.json()).then(setAllCoins);
  }, []);

  const filtered = search.length > 1
    ? allCoins.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.symbol.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 6)
    : [];

  const totalValue = items.reduce((sum, item) => {
    const price = prices.find((p) => p.id === item.id);
    return sum + (price ? price.current_price * item.amount : 0);
  }, 0);

  function handleAdd() {
    if (!selectedCoin || !amount || Number(amount) <= 0) return;
    addItem(
      { id: selectedCoin.id, symbol: selectedCoin.symbol, name: selectedCoin.name, image: selectedCoin.image },
      Number(amount)
    );
    setSelectedCoin(null);
    setSearch("");
    setAmount("");
  }

  return (
    <main className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Портфель</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Итого:{" "}
          <span className="text-white font-mono font-semibold">
            {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalValue)}
          </span>
        </p>
      </div>

      {/* Add form */}
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            {selectedCoin ? (
              <div className="flex items-center gap-2 h-10 px-3 bg-zinc-800 rounded-xl border border-white/10">
                <Image src={selectedCoin.image} alt={selectedCoin.name} width={20} height={20} className="rounded-full" />
                <span className="text-white text-sm">{selectedCoin.name}</span>
                <button
                  onClick={() => { setSelectedCoin(null); setSearch(""); }}
                  className="ml-auto text-zinc-500 hover:text-white"
                >×</button>
              </div>
            ) : (
              <input
                type="text"
                placeholder="Поиск монеты..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
                onFocus={() => setShowDropdown(true)}
                className="w-full h-10 px-3 bg-zinc-800 rounded-xl border border-white/10 text-white placeholder-zinc-500 text-sm outline-none focus:border-violet-500 transition-colors"
              />
            )}
            {showDropdown && filtered.length > 0 && !selectedCoin && (
              <div className="absolute top-12 left-0 right-0 bg-zinc-800 border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                {filtered.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => { setSelectedCoin(coin); setSearch(""); setShowDropdown(false); }}
                    className="w-full flex items-center gap-3 px-3 py-2 hover:bg-white/10 transition-colors text-left"
                  >
                    <Image src={coin.image} alt={coin.name} width={20} height={20} className="rounded-full" />
                    <span className="text-white text-sm">{coin.name}</span>
                    <span className="text-zinc-500 text-xs uppercase ml-auto">{coin.symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <input
            type="number"
            placeholder="Количество"
            value={amount}
            min="0"
            onChange={(e) => setAmount(e.target.value)}
            className="w-full sm:w-36 h-10 px-3 bg-zinc-800 rounded-xl border border-white/10 text-white placeholder-zinc-500 text-sm outline-none focus:border-violet-500 transition-colors"
          />

          <button
            onClick={handleAdd}
            disabled={!selectedCoin || !amount || Number(amount) <= 0}
            className="h-10 px-5 bg-violet-500 hover:bg-violet-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium rounded-xl transition-colors"
          >
            Добавить
          </button>
        </div>
      </div>

      {/* Portfolio list */}
      {items.length === 0 ? (
        <div className="text-center py-16 text-zinc-500">
          Портфель пуст — добавь первую монету
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {items.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              price={prices.find((p) => p.id === item.id)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}
