import { notFound } from "next/navigation";

import { ProductCard } from "@/components/product-card";
import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { getFamily, getProductsByFamily, productFamilies } from "@/lib/site-data";

export async function generateStaticParams() {
  return productFamilies.map((family) => ({ familySlug: family.slug }));
}

export async function generateMetadata(props: PageProps<"/products/families/[familySlug]">) {
  const { familySlug } = await props.params;
  const family = getFamily(familySlug);

  if (!family) {
    return buildMetadata({ title: "Family", path: `/products/families/${familySlug}` });
  }

  return buildMetadata({
    title: family.name,
    description: family.description,
    path: `/products/families/${family.slug}`,
  });
}

export default async function FamilyPage(props: PageProps<"/products/families/[familySlug]">) {
  const { familySlug } = await props.params;
  const family = getFamily(familySlug);

  if (!family) notFound();

  const familyProducts = getProductsByFamily(family.slug);

  return (
    <div className="page-shell space-y-8">
      <SectionHeading eyebrow={family.eyebrow} title={family.name} description={family.description} />
      <Card>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">{family.highlight}</p>
      </Card>
      <div className="grid gap-4 lg:grid-cols-3">
        {familyProducts.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}
