'use client';

import Image from 'next/image';
import type { Coin } from '@/types/coin';

function fmt(n: number, opts?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat('en-US', opts).format(n);
}

function fmtPrice(n: number) {
    if (n >= 1) return fmt(n, { style: 'currency', currency: 'USD', maximumFractionDigits: 2 });
    return fmt(n, { style: 'currency', currency: 'USD', maximumFractionDigits: 6 });
}

function fmtLarge(n: number) {
    if (n >= 1e9) return `$${fmt(n / 1e9, { maximumFractionDigits: 2 })}B`;
    if (n >= 1e6) return `$${fmt(n / 1e6, { maximumFractionDigits: 2 })}M`;
    return fmtPrice(n);
}

interface Props {
    coins: Coin[];
}

export default function CoinTable({ coins }: Props) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-white/10 text-zinc-400 text-left">
                        <th className="py-3 pr-4 font-medium w-10">#</th>
                        <th className="py-3 pr-4 font-medium">Монета</th>
                        <th className="py-3 pr-4 font-medium text-right">Цена</th>
                        <th className="py-3 pr-4 font-medium text-right">24ч %</th>
                        <th className="py-3 pr-4 font-medium text-right hidden md:table-cell">
                            Кап.
                        </th>
                        <th className="py-3 font-medium text-right hidden lg:table-cell">
                            Объём 24ч
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {coins.map((coin) => {
                        const change = coin.price_change_percentage_24h;
                        const isPositive = change >= 0;

                        return (
                            <tr
                                key={coin.id}
                                className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                            >
                                <td className="py-3 pr-4 text-zinc-500">{coin.market_cap_rank}</td>
                                <td className="py-3 pr-4">
                                    <div className="flex items-center gap-3">
                                        <Image
                                            src={coin.image}
                                            alt={coin.name}
                                            width={28}
                                            height={28}
                                            className="rounded-full"
                                        />
                                        <div>
                                            <div className="font-medium text-white">
                                                {coin.name}
                                            </div>
                                            <div className="text-zinc-500 text-xs uppercase">
                                                {coin.symbol}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="py-3 pr-4 text-right font-mono text-white">
                                    {fmtPrice(coin.current_price)}
                                </td>
                                <td
                                    className={`py-3 pr-4 text-right font-mono font-medium ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}
                                >
                                    {isPositive ? '+' : ''}
                                    {fmt(change, { maximumFractionDigits: 2 })}%
                                </td>
                                <td className="py-3 pr-4 text-right text-zinc-300 hidden md:table-cell">
                                    {fmtLarge(coin.market_cap)}
                                </td>
                                <td className="py-3 text-right text-zinc-300 hidden lg:table-cell">
                                    {fmtLarge(coin.total_volume)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
