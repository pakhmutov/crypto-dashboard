"use client";

import { useEffect, useRef, useState } from "react";

interface TickerData {
  price: number;
  change24h: number;
}

export function useRealtimePrice(symbol: string, initialPrice: number, initialChange: number): TickerData {
  const [data, setData] = useState<TickerData>({ price: initialPrice, change24h: initialChange });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Binance symbol format: btcusdt, ethusdt, etc.
    const stream = `${symbol.toLowerCase()}usdt@ticker`;
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${stream}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setData({
        price: parseFloat(msg.c),
        change24h: parseFloat(msg.P),
      });
    };

    ws.onerror = () => ws.close();

    return () => ws.close();
  }, [symbol]);

  return data;
}
