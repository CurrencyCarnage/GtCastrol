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
      title: "Vehicle-led finder",
      description: "Guide retail and workshop users from vehicle context into the right Castrol family.",
      Icon: Gauge,
    },
    {
      title: "Branch booking",
      description: "Connect recommendations to service centers and city-based branch coverage.",
      Icon: MapPinned,
    },
    {
      title: "Commerce handoff",
      description: "Keep product detail, pricing, pack size, and cart behavior ready for integration.",
      Icon: ShoppingBag,
    },
    {
      title: "Business structure",
      description: "Support passenger, hybrid, and commercial service journeys in one platform.",
      Icon: Wrench,
    },
  ];

  const heroStats = [
    { value: "8", label: "Core product families" },
    { value: "4", label: "Cities prepared" },
    { value: "36", label: "Launch-ready routes" },
  ];

  const platformSignals = [
    {
      title: "Castrol-first visual system",
      description: "Green-led branding, cleaner white surfaces, and restrained red accents aligned to the product identity.",
    },
    {
      title: "GT Group style structure",
      description: "Service, news, contact, and business-direction framing translated into a more useful digital product shell.",
    },
    {
      title: "Retail plus B2B readiness",
      description: "Passenger drivers, workshops, and fleet operators can all be routed through the same catalogue foundation.",
    },
  ];

  return (
    <div className="page-shell space-y-10">
      <section className="hero-panel grid-glow overflow-hidden px-5 py-8 sm:px-10 sm:py-14">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-10">
          <div className="space-y-7">
            <p className="text-xs uppercase tracking-[0.18em] text-white/82">
              Castrol-aligned discovery, booking, and commerce foundation
            </p>
            <div className="space-y-4">
              <h1 className="max-w-4xl font-display text-4xl uppercase leading-[0.92] tracking-[0.06em] text-[var(--accent)] sm:text-6xl sm:leading-none">
                Product and service journeys for Castrol Georgia.
              </h1>
              <p className="max-w-2xl text-base leading-8 text-white/82">
                A cleaner, greener first version of the platform that connects product selection, branch booking, and commerce handoff around real Castrol families and service needs.
              </p>
            </div>
            <div className="grid gap-3 sm:flex sm:flex-wrap">
              <LinkButton href="/finder" className="w-full justify-center text-black sm:w-auto">
                Launch product finder
              </LinkButton>
              <LinkButton href="/booking" variant="secondary" className="w-full justify-center text-black sm:w-auto">
                Book service
              </LinkButton>
              <LinkButton href="/products" variant="ghost" className="w-full justify-center text-black sm:w-auto">
                Browse catalogue
              </LinkButton>
            </div>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.35rem] border border-white/18 bg-[rgba(255,255,255,0.1)] px-3 py-4 backdrop-blur-sm sm:rounded-[1.5rem] sm:px-4"
                >
                  <p className="font-display text-2xl uppercase tracking-[0.08em] text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.16em] text-white/78 sm:text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {heroHighlights.map(({ title, description, Icon }) => (
              <div
                key={title}
                className="rounded-[1.75rem] border border-white/35 bg-[rgba(255,255,255,0.92)] p-5 shadow-[0_18px_40px_rgba(10,43,24,0.12)]"
              >
                <Icon className="h-6 w-6 text-[var(--brand)]" />
                <h2 className="mt-4 font-display text-xl uppercase tracking-[0.08em] text-[var(--accent)]">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-6 text-[rgba(23,52,35,0.72)]">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[2rem] border border-[rgba(0,91,42,0.12)] bg-white px-6 py-7 shadow-[0_18px_40px_rgba(12,52,30,0.06)]">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Brand transition note</p>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-[var(--foreground)]">
            From dark tech mockup to Castrol-led business platform
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
            This first redesign pass moves the product closer to Castrol and GT Group by replacing the black-neon styling with cleaner green surfaces, white content cards, and a more corporate service presentation.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {platformSignals.map((signal) => (
            <div
              key={signal.title}
              className="rounded-[1.75rem] border border-[rgba(0,91,42,0.12)] bg-white p-5 shadow-[0_18px_40px_rgba(12,52,30,0.06)]"
            >
              <p className="text-xs uppercase tracking-[0.16em] text-[var(--accent)]">Platform signal</p>
              <h3 className="mt-3 font-display text-xl uppercase tracking-[0.08em] text-[var(--foreground)]">
                {signal.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-[var(--muted-foreground)]">{signal.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Top product families"
          title="Catalogue built around real Castrol family structure"
          description="Seeded from the client-provided family breakdown and now presented in a clearer corporate catalogue style that can support both retail and workshop flows."
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {productFamilies.map((family) => (
            <Card key={family.slug} className="space-y-3">
              <p className="text-xs uppercase tracking-[0.14em] text-white/82">{family.eyebrow}</p>
              <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">{family.name}</h3>
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
          description="The first pass keeps product detail routes, pack-size modelling, and cart hooks, but frames them inside a cleaner Castrol-style presentation."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {products.filter((product) => product.featured).slice(0, 6).map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <Card className="space-y-4">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-[var(--accent)]">
            Service-center structure
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            GT Group&apos;s service-oriented structure informs this section: branch coverage, trust markers, and city-level access points are made visible instead of buried behind product detail pages.
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {serviceCenters.map((center) => (
              <div key={center.slug} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/82">{center.city}</p>
                <h3 className="mt-2 font-semibold text-[var(--accent)]">{center.name}</h3>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">{center.openingHours}</p>
              </div>
            ))}
          </div>
          <LinkButton href="/service-centers" variant="secondary">
            Explore service centers
          </LinkButton>
        </Card>
        <Card className="space-y-4">
          <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-[var(--accent)]">
            News and campaign layer
          </h2>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            Both reference sites lean heavily on clear company updates and campaign framing. This foundation keeps blog and campaign routes visible as part of the main business surface.
          </p>
          <div className="space-y-3">
            {blogPosts.map((post) => (
              <div key={post.slug} className="rounded-2xl border border-white/12 bg-white/8 p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-white/82">{post.category}</p>
                <h3 className="mt-2 font-semibold text-[var(--accent)]">{post.title}</h3>
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
