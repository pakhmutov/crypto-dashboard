"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Coin } from "@/types/coin";
import type { PortfolioItem } from "@/store/portfolioStore";

function fmtUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1 ? 2 : 6,
  }).format(n);
}

function fmtPct(n: number) {
  return `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`;
}

interface Props {
  item: PortfolioItem;
  price: Coin | undefined;
  onRemove: () => void;
}

export default function PortfolioCard({ item, price, onRemove }: Props) {
  const router = useRouter();
  const totalValue = price ? price.current_price * item.amount : null;
  const change = price?.price_change_percentage_24h;

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-4 flex items-center gap-4">
      <div
        className="flex items-center gap-3 flex-1 cursor-pointer"
        onClick={() => router.push(`/coin/${item.id}`)}
      >
        <Image src={item.image} alt={item.name} width={36} height={36} className="rounded-full" />
        <div>
          <div className="font-medium text-white">{item.name}</div>
          <div className="text-zinc-500 text-xs uppercase">{item.symbol}</div>
        </div>
      </div>

      <div className="text-right hidden sm:block">
        <div className="text-xs text-zinc-500 mb-0.5">Количество</div>
        <div className="font-mono text-sm text-white">{item.amount}</div>
      </div>

      <div className="text-right hidden sm:block">
        <div className="text-xs text-zinc-500 mb-0.5">Цена</div>
        <div className="font-mono text-sm text-white">
          {price ? fmtUsd(price.current_price) : "—"}
        </div>
      </div>

      {change !== undefined && (
        <div className={`text-right hidden md:block ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
          <div className="text-xs text-zinc-500 mb-0.5">24ч</div>
          <div className="font-mono text-sm">{fmtPct(change)}</div>
        </div>
      )}

      <div className="text-right">
        <div className="text-xs text-zinc-500 mb-0.5">Сумма</div>
        <div className="font-mono text-sm font-semibold text-white">
          {totalValue !== null ? fmtUsd(totalValue) : "—"}
        </div>
      </div>

      <button
        onClick={onRemove}
        className="text-zinc-600 hover:text-red-400 transition-colors ml-2 text-lg leading-none"
        aria-label="Удалить"
      >
        ×
      </button>
    </div>
  );
}
