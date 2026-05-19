import type { Coin } from "@/types/coin";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function getTopCoins(perPage = 50): Promise<Coin[]> {
  const url = new URL(`${BASE_URL}/coins/markets`);
  url.searchParams.set("vs_currency", "usd");
  url.searchParams.set("order", "market_cap_desc");
  url.searchParams.set("per_page", String(perPage));
  url.searchParams.set("page", "1");
  url.searchParams.set("sparkline", "false");

  const res = await fetch(url.toString(), {
    next: { revalidate: 60 },
    headers: { accept: "application/json" },
  });

  if (!res.ok) throw new Error(`CoinGecko error: ${res.status}`);

  return res.json();
}
