import { ArrowRight, Gauge, MapPinned, ShoppingBag, Wrench } from "lucide-react";

import { ProductCard } from "@/components/product-card";
import { Card, LinkButton, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, productFamilies, products, serviceCenters } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Home",
  path: "/",
});

export default function HomePage() {
  const heroHighlights = [
    {
      title: "Finder-first journey",
      description: "Vehicle and service-intent based product recommendation.",
      Icon: Gauge,
    },
    {
      title: "Branch-aware booking",
      description: "Connect recommended products to real service-center locations.",
      Icon: MapPinned,
    },
    {
      title: "Commerce hooks",
      description: "Pack-size, cart, and pricing placeholders ready for backend wiring.",
      Icon: ShoppingBag,
    },
    {
      title: "Workshop trust",
      description: "Service offerings, trust markers, and city-specific branch coverage.",
      Icon: Wrench,
    },
  ];

  return (
    <div className="page-shell space-y-10">
      <section className="hero-panel grid-glow overflow-hidden px-6 py-8 sm:px-10 sm:py-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
              Product finder + booking + ecommerce foundation
            </p>
            <div className="space-y-4">
              <h1 className="max-w-4xl font-display text-5xl uppercase leading-none tracking-[0.06em] text-white sm:text-6xl">
                Precision lubricant discovery for Castrol Georgia.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-[var(--muted-foreground)]">
                A premium automotive platform that connects product compatibility, nearby service centers, online booking, and commerce-ready product detail pages.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/finder">Launch product finder</LinkButton>
              <LinkButton href="/booking" variant="secondary">
                Book service
              </LinkButton>
              <LinkButton href="/products" variant="ghost">
                Browse catalogue
              </LinkButton>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroHighlights.map(({ title, description, Icon }) => (
              <Card key={title} className="space-y-3">
                <Icon className="h-6 w-6 text-[var(--brand)]" />
                <h2 className="font-display text-xl uppercase tracking-[0.08em] text-white">
                  {title}
                </h2>
                <p className="text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Top product families"
          title="Catalogue built around real Castrol family structure"
          description="Seeded from the client-provided Excel family breakdown: EDGE, MAGNATEC, GTX, MAGNATEC Hybrid, Castrol ON, Vecton, CRB, and Transmax."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productFamilies.map((family) => (
            <Card key={family.slug} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{family.eyebrow}</p>
              <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">{family.name}</h3>
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">{family.highlight}</p>
              <LinkButton href={`/products/families/${family.slug}`} variant="ghost" className="mt-2 px-0 py-0">
                Explore family <ArrowRight className="ml-2 h-4 w-4" />
              </LinkButton>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured products"
          title="Commerce-ready product cards"
          description="The first pass already supports product detail routes, pack-size modelling, cart hooks, and future pricing-tier separation."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {products.filter((product) => product.featured).slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
            Service-center booking CTA
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Initial geography support is prepared for Tbilisi, Kutaisi, Batumi, and Marneuli with trust badges and branch-specific inventory hooks.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceCenters.map((center) => (
              <div key={center.slug} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{center.city}</p>
                <h3 className="mt-2 font-semibold text-white">{center.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{center.openingHours}</p>
              </div>
            ))}
          </div>
          <LinkButton href="/service-centers" variant="secondary">
            Explore service centers
          </LinkButton>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white">
            Content and campaign engine
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Blog and landing-page templates are part of the foundation so SEO and campaign conversion do not arrive as an afterthought.
          </p>
          <div className="space-y-3">
            {blogPosts.map((post) => (
              <div key={post.slug} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">{post.category}</p>
                <h3 className="mt-2 font-semibold text-white">{post.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{post.excerpt}</p>
              </div>
            ))}
          </div>
          <LinkButton href="/blog" variant="ghost">
            Visit blog
          </LinkButton>
        </Card>
      </section>
    </div>
  );
}
