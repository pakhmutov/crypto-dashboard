"use client";

import { useEffect, useRef } from "react";
import { useRealtimePrice } from "@/hooks/useRealtimePrice";

function fmtPrice(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n >= 1 ? 2 : 6,
  }).format(n);
}

interface Props {
  symbol: string;
  initialPrice: number;
  initialChange: number;
}

export default function PriceTicker({ symbol, initialPrice, initialChange }: Props) {
  const { price, change24h } = useRealtimePrice(symbol, initialPrice, initialChange);
  const prevPrice = useRef(price);
  const priceRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!priceRef.current || price === prevPrice.current) return;

    const el = priceRef.current;
    const flash = price > prevPrice.current ? "text-emerald-400" : "text-red-400";
    el.classList.add(flash);
    const timer = setTimeout(() => el.classList.remove(flash), 500);

    prevPrice.current = price;
    return () => clearTimeout(timer);
  }, [price]);

  const isPositive = change24h >= 0;

  return (
    <div className="flex items-center gap-3 mt-1">
      <span
        ref={priceRef}
        className="text-2xl font-mono font-semibold text-white transition-colors duration-300"
      >
        {fmtPrice(price)}
      </span>
      <span className={`font-mono text-sm font-medium ${isPositive ? "text-emerald-400" : "text-red-400"}`}>
        {isPositive ? "+" : ""}{change24h.toFixed(2)}%
      </span>
      <span className="text-xs text-zinc-600 font-mono">LIVE</span>
    </div>
  );
}
