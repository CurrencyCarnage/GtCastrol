"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { Card, Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/domain";

type ProductCardProduct = Product & {
  imagePath?: string;
};

export function ProductCard({ product }: { product: ProductCardProduct }) {
  const add = useCartStore((state) => state.add);

  return (
    <Card className="flex h-full flex-col gap-5">
      {product.imagePath ? (
        <div className="relative -mx-2 -mt-2 aspect-[4/3] overflow-hidden rounded-xl border border-white/16 bg-white/10">
          <Image
            src={product.imagePath}
            alt={product.name}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            className="object-cover transition duration-300 hover:scale-[1.03]"
            unoptimized
          />
        </div>
      ) : null}
      <div className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">{product.segment}</p>
        <div>
          <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">
            {product.name}
          </h3>
          <p className="mt-2 text-sm leading-7 text-white/84">{product.headline}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {product.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="rounded-full border border-white/18 px-3 py-1 text-xs text-white/84">
            {tag}
          </span>
        ))}
      </div>
      <div className="mt-auto space-y-3">
        <Link
          href={`/products/${product.slug}`}
          className="inline-flex w-fit items-center rounded-full border border-white/22 px-3 py-1.5 text-sm font-semibold !text-[var(--castrol-yellow)] visited:!text-[var(--castrol-yellow)] transition hover:border-white/38 hover:bg-white/10 hover:!text-white hover:shadow-[0_8px_20px_rgba(255,255,255,0.08)]"
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
