import { ProductCard } from "@/components/product-card";
import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { productCategories, productFamilies, products } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Product Catalogue",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="Product Catalogue"
        title="Structured catalogue with family and product routes"
        description="Built around normalized category, family, and product models so real imports from Excel, CMS, or ERP can replace the seed layer later."
      />
      <div className="grid gap-4 lg:grid-cols-3">
        {productCategories.map((category) => (
          <Card key={category.slug} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-white/82">{category.segment}</p>
            <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">{category.name}</h2>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">{category.description}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {productFamilies.map((family) => (
          <Card key={family.slug} className="space-y-3">
            <p className="text-xs uppercase tracking-[0.14em] text-white/82">{family.eyebrow}</p>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">{family.name}</h3>
            <p className="text-sm leading-6 text-[var(--muted-foreground)]">{family.description}</p>
            <a href={`/products/families/${family.slug}`} className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
              Open family page
            </a>
          </Card>
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
