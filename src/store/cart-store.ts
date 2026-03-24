"use client";

import { create } from "zustand";
import type { Product } from "@/types/domain";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  priceLabel: string;
  packLabel: string;
  quantity: number;
}

interface CartStore {
  isOpen: boolean;
  items: CartItem[];
  count: number;
  open: () => void;
  close: () => void;
  toggle: () => void;
  add: (product: Product) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
}

function toCartItem(product: Product): CartItem {
  const defaultVariant = product.packSizes[0];

  return {
    productId: product.id,
    slug: product.slug,
    name: product.name,
    priceLabel: defaultVariant?.priceLabel ?? "Price on request",
    packLabel: defaultVariant?.label ?? "Standard pack",
    quantity: 1,
  };
}

export const useCartStore = create<CartStore>((set) => ({
  isOpen: false,
  items: [],
  count: 0,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  add: (product) =>
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);
      const items = existing
        ? state.items.map((item) =>
            item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item,
          )
        : [...state.items, toCartItem(product)];

      return {
        items,
        count: state.count + 1,
        isOpen: true,
      };
    }),
  increment: (productId) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item,
      ),
      count: state.count + 1,
    })),
  decrement: (productId) =>
    set((state) => {
      const target = state.items.find((item) => item.productId === productId);

      if (!target) {
        return state;
      }

      return {
        items:
          target.quantity === 1
            ? state.items.filter((item) => item.productId !== productId)
            : state.items.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity - 1 } : item,
              ),
        count: Math.max(0, state.count - 1),
      };
    }),
  remove: (productId) =>
    set((state) => {
      const target = state.items.find((item) => item.productId === productId);

      if (!target) {
        return state;
      }

      return {
        items: state.items.filter((item) => item.productId !== productId),
        count: Math.max(0, state.count - target.quantity),
      };
    }),
  clear: () => set({ items: [], count: 0 }),
}));
