"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, type Time } from "lightweight-charts";

const PERIODS = [
  { label: "1Н", days: 7 },
  { label: "1М", days: 30 },
  { label: "3М", days: 90 },
  { label: "1Г", days: 365 },
];

interface Props {
  coinId: string;
  initialData: number[][];
}

function toSeriesData(raw: number[][]) {
  return raw.map(([time, open, high, low, close]) => ({
    time: (time / 1000) as Time,
    open,
    high,
    low,
    close,
  }));
}

export default function PriceChart({ coinId, initialData }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const [activeDays, setActiveDays] = useState(7);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { color: "transparent" },
        textColor: "#a1a1aa",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      crosshair: { mode: 1 },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.1)" },
      timeScale: {
        borderColor: "rgba(255,255,255,0.1)",
        timeVisible: true,
      },
      width: containerRef.current.clientWidth,
      height: 380,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderUpColor: "#34d399",
      borderDownColor: "#f87171",
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });

    series.setData(toSeriesData(initialData));
    chart.timeScale().fitContent();

    chartRef.current = chart;
    seriesRef.current = series;

    const observer = new ResizeObserver(() => {
      if (containerRef.current) chart.applyOptions({ width: containerRef.current.clientWidth });
    });
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      chart.remove();
    };
  }, []);

  async function changePeriod(days: number) {
    if (days === activeDays || !seriesRef.current) return;
    setActiveDays(days);
    setLoading(true);

    try {
      const res = await fetch(`/api/chart/${coinId}?days=${days}`);
      const data: number[][] = await res.json();
      seriesRef.current.setData(toSeriesData(data));
      chartRef.current?.timeScale().fitContent();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-zinc-900 rounded-2xl border border-white/10 p-4">
      <div className="flex items-center gap-1 mb-4">
        {PERIODS.map((p) => (
          <button
            key={p.days}
            onClick={() => changePeriod(p.days)}
            className={`px-3 py-1 rounded-lg text-sm transition-colors ${
              activeDays === p.days
                ? "bg-violet-500 text-white"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            {p.label}
          </button>
        ))}
        {loading && <span className="ml-2 text-xs text-zinc-500">Загрузка...</span>}
      </div>
      <div ref={containerRef} />
    </div>
  );
}
