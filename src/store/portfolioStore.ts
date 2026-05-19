import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PortfolioItem {
  id: string;
  symbol: string;
  name: string;
  image: string;
  amount: number;
}

interface PortfolioStore {
  items: PortfolioItem[];
  addItem: (coin: Omit<PortfolioItem, "amount">, amount: number) => void;
  removeItem: (id: string) => void;
  updateAmount: (id: string, amount: number) => void;
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set) => ({
      items: [],
      addItem: (coin, amount) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === coin.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === coin.id ? { ...i, amount: i.amount + amount } : i
              ),
            };
          }
          return { items: [...state.items, { ...coin, amount }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateAmount: (id, amount) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, amount } : i)),
        })),
    }),
    { name: "crypto-portfolio" }
  )
);
