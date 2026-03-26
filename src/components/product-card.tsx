"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Card, Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/domain";

export function ProductCard({ product }: { product: Product }) {
  const add = useCartStore((state) => state.add);

  return (
    <Card className="flex h-full flex-col gap-5">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.14em] text-white/82">{product.segment}</p>
        <div>
          <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-7 text-[var(--muted-foreground)]">{product.headline}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted-foreground)]">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto space-y-3">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex w-fit items-center rounded-full border border-white/12 px-3 py-1.5 text-sm font-semibold !text-white visited:!text-white transition hover:border-white/30 hover:bg-white/10 hover:!text-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.08)]"
        >
          View product detail
        </Link>
        <Button
          className="w-full"
          onClick={() => {
            add(product);
            trackEvent({ name: "add_to_cart", payload: { productSlug: product.slug, productName: product.name } });
          }}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Add to cart
        </Button>
      </div>
    </Card>
  );
}
