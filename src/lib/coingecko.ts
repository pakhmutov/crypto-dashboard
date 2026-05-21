import type { Coin } from "@/types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";

async function cgFetch<T>(path: string, params: Record<string, string>, revalidate = 60): Promise<T> {
  const url = new URL(`${BASE_URL}${path}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    next: { revalidate },
    headers: { accept: "application/json" },
  });

  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);
  return res.json();
}

export function getTopCoins(perPage = 50): Promise<Coin[]> {
  return cgFetch("/coins/markets", {
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(perPage),
    page: "1",
    sparkline: "true",
  });
}

export function getCoinInfo(id: string): Promise<Coin> {
  return cgFetch(`/coins/markets`, {
    vs_currency: "usd",
    ids: id,
    sparkline: "false",
  }, 60).then((arr: unknown) => (arr as Coin[])[0]);
}

export function getCoinsByIds(ids: string[]): Promise<Coin[]> {
  return cgFetch("/coins/markets", {
    vs_currency: "usd",
    ids: ids.join(","),
    order: "market_cap_desc",
    sparkline: "false",
  }, 30);
}

// Returns [[timestamp_ms, open, high, low, close], ...]
export function getCoinOHLC(id: string, days: number): Promise<number[][]> {
  return cgFetch(`/coins/${id}/ohlc`, {
    vs_currency: "usd",
    days: String(days),
  }, 60);
}
