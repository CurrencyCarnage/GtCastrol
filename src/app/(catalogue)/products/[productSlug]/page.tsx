import { notFound } from "next/navigation";

import { Button, Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { getProduct, products } from "@/lib/site-data";

export async function generateStaticParams() {
  return products.map((product) => ({ productSlug: product.slug }));
}

export async function generateMetadata(props: PageProps<"/products/[productSlug]">) {
  const { productSlug } = await props.params;
  const product = getProduct(productSlug);

  if (!product) {
    return buildMetadata({ title: "Product", path: `/products/${productSlug}` });
  }

  return buildMetadata({
    title: product.name,
    description: product.headline,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage(props: PageProps<"/products/[productSlug]">) {
  const { productSlug } = await props.params;
  const product = getProduct(productSlug);

  if (!product) notFound();

  return (
    <div className="page-shell space-y-8">
      <SectionHeading eyebrow={product.segment} title={product.name} description={product.headline} />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-5">
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">{product.description}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {product.specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/82">{spec.label}</p>
                <p className="mt-2 text-sm text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">Pack sizes</h2>
          <div className="space-y-3">
            {product.packSizes.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 p-4">
                <div>
                  <p className="font-semibold text-[var(--accent)]">{variant.label}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted-foreground)]">{variant.inventoryStatus}</p>
                </div>
                <p className="text-sm text-white">{variant.priceLabel}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Add to cart</Button>
            <a href="/booking" className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--accent)]">
              Add to booking
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
