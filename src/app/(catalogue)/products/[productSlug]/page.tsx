import Link from "next/link";
import { notFound } from "next/navigation";

import { Button, Card, SectionHeading } from "@/components/ui";
import { getManagedProduct } from "@/lib/catalog-store";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function generateMetadata(props: PageProps<"/products/[productSlug]">) {
  const { productSlug } = await props.params;
  const product = await getManagedProduct(productSlug);

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
  const product = await getManagedProduct(productSlug);

  if (!product) notFound();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/products" className="hover:underline">
            Products
          </Link>{" "}
          &gt; {product.name}
        </p>
        <SectionHeading
          eyebrow={product.segment}
          title={product.name}
          description={product.headline}
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="space-y-5">
          <p className="text-sm leading-7 text-white/84">{product.description}</p>
          <div className="grid gap-3 md:grid-cols-2">
            {product.specs.map((spec) => (
              <div key={spec.label} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">{spec.label}</p>
                <p className="mt-2 text-sm font-semibold text-white">{spec.value}</p>
              </div>
            ))}
          </div>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">Pack sizes</h2>
          <div className="space-y-3">
            {product.packSizes.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between rounded-2xl border border-white/12 bg-white/8 p-4">
                <div>
                  <p className="font-semibold text-white">{variant.label}</p>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--castrol-yellow)]">{variant.inventoryStatus}</p>
                </div>
                <p className="text-sm text-white/92">{variant.priceLabel}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Add to cart</Button>
            <a
              href="/booking"
              className="inline-flex items-center justify-center rounded-full border border-white/28 bg-white/95 px-5 py-3 text-sm font-semibold uppercase tracking-[0.12em] text-[var(--text-dark)] transition hover:bg-white hover:border-white hover:text-[var(--castrol-green-deep)]"
            >
              Add to booking
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
}
