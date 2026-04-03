import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Card, SectionHeading } from "@/components/ui";
import { getManagedProducts } from "@/lib/catalog-store";
import { buildMetadata } from "@/lib/seo";
import { productCategories, productFamilies } from "@/lib/site-data";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Product Catalogue",
  path: "/products",
});

export default async function ProductsPage() {
  const products = await getManagedProducts();

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; Products
        </p>
        <SectionHeading
          eyebrow="Product Catalogue"
          title="Structured catalogue with family and product routes"
          description="Built around normalized category, family, and product models so real imports from Excel, CMS, or ERP can replace the seed layer later."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {productCategories.map((category) => (
          <Card key={category.slug} className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">{category.segment}</p>
            <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">{category.name}</h2>
            <p className="text-sm leading-7 text-white/84">{category.description}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productFamilies.map((family) => (
          <Link
            key={family.slug}
            href={`/products/families/${family.slug}`}
            className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
          >
            <Card className="brand-divider flex h-full flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">{family.eyebrow}</p>
              <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">{family.name}</h3>
              <p className="text-sm leading-6 text-white/84">{family.description}</p>
              <p className="mt-auto inline-flex items-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--castrol-yellow)] transition-colors duration-200 group-hover:text-white">
                Open family page <ArrowRight className="ml-2 h-4 w-4" />
              </p>
            </Card>
          </Link>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
