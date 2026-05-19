# Crypto Dashboard

Personal crypto portfolio and market tracker built with Next.js.

**Live:** https://crypto-dashboard-vp.vercel.app

## Features

- **Market** — top-50 coins by market cap with price, 24h change, volume
- **Coin page** — candlestick chart (TradingView Lightweight Charts) with period selector (1W / 1M / 3M / 1Y), live price via Binance WebSocket
- **Portfolio** — add coins with amounts, track total value in USD, persisted in localStorage

## Stack

- Next.js 16 · React · TypeScript
- Tailwind CSS
- Zustand (portfolio state)
- TradingView Lightweight Charts v5
- CoinGecko API · Binance WebSocket

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).
