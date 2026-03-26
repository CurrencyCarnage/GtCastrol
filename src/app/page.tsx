import {
  ArrowRight,
  Building2,
  CalendarClock,
  CarFront,
  Factory,
  MapPin,
  MapPinned,
  SearchCheck,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { HomeFinderSearch } from "@/components/home-finder-search";
import { Card, LinkButton, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, campaignPages, products, serviceCenters } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Home",
  path: "/",
});

export default function HomePage() {
  const heroHighlights = [
    {
      title: "Vehicle-led product matching",
      description: "Start from vehicle context and route users toward the right Castrol family.",
      Icon: SearchCheck,
    },
    {
      title: "Branch booking pathways",
      description: "Connect recommendations to city-level service centers and scheduling flows.",
      Icon: MapPinned,
    },
    {
      title: "Commerce handoff ready",
      description: "Support catalogue browsing and staged cart behavior for local ecommerce integration.",
      Icon: ShoppingBag,
    },
  ];

  const heroUtilityBadges = [
    "Official Castrol product families",
    "Authorized service network",
    "Georgia city coverage",
  ];

  const quickActions = [
    { label: "Product Finder", href: "/finder", Icon: SearchCheck },
    { label: "Where to Buy", href: "/products", Icon: ShoppingBag },
    { label: "Service Centers", href: "/service-centers", Icon: MapPinned },
    { label: "Book a Service", href: "/booking", Icon: CalendarClock },
    { label: "For Business Customers", href: "/contact", Icon: Factory },
  ] as const;

  const journeys = [
    {
      title: "Passenger Cars",
      description: "Find approved oils and practical service paths for daily-driving passenger vehicles.",
      meta: "Road-use coverage",
      href: "/finder",
      Icon: CarFront,
    },
    {
      title: "Commercial / Fleet",
      description: "Route logistics and transport operators into heavy-duty products and branch support.",
      meta: "Fleet-ready operations",
      href: "/products/families/vecton",
      Icon: Truck,
    },
    {
      title: "Workshops / Partners",
      description: "Support independent and partner workshops with product families and booking integration.",
      meta: "Service partner focused",
      href: "/service-centers",
      Icon: Wrench,
    },
  ] as const;

  const finderAccess = [
    "Search by vehicle make and model",
    "Browse by oil family and approvals",
    "Find by service need and usage type",
  ];

  const featuredProducts = products.filter((product) => product.featured).slice(0, 3);
  const featuredCenters = serviceCenters.slice(0, 4);

  const trustSignals = [
    "Official distributor pathways",
    "Authentic Castrol product sourcing",
    "Workshop and fleet readiness",
    "Georgian branch support coverage",
  ];

  const localMetrics = [
    { label: "Featured cities", value: "4" },
    { label: "Core product families", value: "8" },
    { label: "Service routes in platform", value: "30+" },
  ];

  const insightCards = [
    ...blogPosts.slice(0, 2).map((post) => ({
      title: post.title,
      category: post.category,
      excerpt: post.excerpt,
      href: `/blog/${post.slug}`,
    })),
    ...campaignPages.slice(0, 1).map((campaign) => ({
      title: campaign.title,
      category: "Campaign",
      excerpt: campaign.summary,
      href: `/campaigns/${campaign.slug}`,
    })),
  ];

  return (
    <div className="page-shell space-y-7 sm:space-y-9">
      <section className="hero-panel hero-directional grid-glow reveal-up relative overflow-hidden px-5 py-8 sm:px-9 sm:py-12">
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-10">
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="max-w-4xl font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white sm:text-6xl">
                Find the right Castrol product and book the right service.
              </h1>
              <p className="max-w-2xl text-sm leading-7 text-white/82 sm:text-base">
                Discover oils, fluids, and service pathways tailored to your vehicle, your city, and our authorized Georgian network.
              </p>
            </div>
            <HomeFinderSearch />
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:items-center">
                <LinkButton href="/finder" variant="secondary" className="w-full justify-center sm:w-auto">
                  Launch Product Finder
                </LinkButton>
                <LinkButton href="/booking" variant="secondary" className="w-full justify-center sm:w-auto">
                  Book Service
                </LinkButton>
              </div>
              <LinkButton
                href="/products"
                variant="secondary"
                className="w-full justify-center sm:ml-2 sm:w-auto"
              >
                Explore Catalogue <ArrowRight className="ml-1.5 h-4 w-4" />
              </LinkButton>
            </div>
            <div className="flex flex-wrap gap-2">
              {heroUtilityBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-lg border border-white/18 bg-[rgba(255,255,255,0.1)] px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="rounded-2xl border border-white/20 bg-[var(--charcoal-overlay)] p-5 backdrop-blur-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/72">Georgia Network Coverage</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                {["Tbilisi", "Batumi", "Kutaisi", "Rustavi"].map((city) => (
                  <div key={city} className="flex items-center gap-2 rounded-lg border border-white/14 bg-white/8 px-3 py-2">
                    <MapPin className="h-3.5 w-3.5 text-[var(--castrol-yellow)]" />
                    <span>{city}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/72">Primary Journeys</p>
              <div className="space-y-3">
                {heroHighlights.map(({ title, description, Icon }) => (
                  <div key={title} className="rounded-xl border border-white/20 bg-[rgba(255,255,255,0.14)] p-4 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-white" />
                      <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-white">{title}</h2>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-white/78">{description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="quick-action-strip reveal-up px-3 py-3 sm:px-4">
        <div className="flex gap-2 overflow-x-auto pb-1 sm:grid sm:grid-cols-5 sm:gap-3 sm:overflow-visible">
          {quickActions.map(({ label, href, Icon }) => (
            <LinkButton
              key={label}
              href={href}
              variant="ghost"
              className="min-w-[13.5rem] shrink-0 justify-start rounded-lg border border-[rgba(30,42,35,0.1)] bg-white px-3 py-2 text-[11px] text-[var(--foreground)] hover:border-[var(--castrol-green-dark)] sm:min-w-0"
            >
              <Icon className="mr-2 h-4 w-4 text-[var(--castrol-green-deep)]" />
              {label}
            </LinkButton>
          ))}
        </div>
      </section>

      <section className="space-y-6 reveal-up">
        <SectionHeading
          eyebrow="Core Journeys"
          title="Choose the Castrol pathway that fits your vehicle and operation model"
          description="Structured customer entries for passenger cars, commercial fleets, and workshop partners across Georgia."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {journeys.map(({ title, description, meta, href, Icon }) => (
            <Link
              key={title}
              href={href}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <Card tone="surface" className="brand-divider flex h-full flex-col gap-4 pt-6">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[rgba(30,42,35,0.14)] bg-[var(--off-white)] text-[var(--castrol-green-deep)] transition-colors duration-200 group-hover:text-[var(--castrol-green-deep)]">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] transition-colors duration-200">
                  {title}
                </h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-[var(--castrol-green-dark)]">
                  {description}
                </p>
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--text-dark)] transition-colors duration-200">
                  {meta}
                </p>
                <p className="mt-auto inline-flex items-center text-sm font-semibold uppercase tracking-[0.1em] text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--castrol-green-deep)]">
                  Enter Journey <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6 reveal-up">
        <SectionHeading
          eyebrow="Product Finder"
          title="Use the fastest route from vehicle context to approved Castrol products"
          description="The finder is a core utility block: practical, route-focused, and ready to hand users into booking or commerce."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card tone="surface" className="space-y-5">
            <h3 className="font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
              Launch the finder and narrow quickly
            </h3>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Start from vehicle, product family, or usage need. The flow is aligned to local service-center outcomes, not generic ecommerce browsing.
            </p>
            <div className="space-y-2">
              {finderAccess.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-[rgba(30,42,35,0.12)] bg-[var(--off-white)] px-3 py-2 text-sm text-[var(--foreground)]"
                >
                  <SearchCheck className="h-4 w-4 text-[var(--castrol-green-deep)]" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href="/finder"
                className="!rounded-full !border-[#00b050] !bg-[#00a94a] !text-white !shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_18px_rgba(0,122,55,0.24)] hover:!translate-y-0 hover:!bg-[#00a94a] hover:!border-[#00b050] hover:!shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_18px_rgba(0,122,55,0.24)]"
              >
                Start Product Finder
              </LinkButton>
              <LinkButton href="/products" variant="secondary">
                Browse All Products
              </LinkButton>
            </div>
          </Card>

          <Card tone="panel" className="space-y-5 border-[rgba(30,42,35,0.14)] bg-[linear-gradient(160deg,#ffffff,#f3f6f0)]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-red)]">Finder Entry Mockup</p>
            <div className="space-y-4">
              {[
                ["Vehicle", "Select make and model"],
                ["Oil Family", "EDGE, MAGNATEC, GTX, Vecton"],
                ["Usage", "Daily drive, heavy duty, hybrid"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{label}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--foreground)]">{value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-dashed border-[rgba(30,42,35,0.2)] bg-white px-4 py-4">
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Result path: compatible products, closest authorized service center, and booking-ready CTA.
              </p>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Featured Products"
          title="Key Castrol families available for local route-to-service decisions"
          description="Direct links to product detail pages with practical journey continuation into booking and service-center workflows."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <Link
              key={product.slug}
              href={`/products/${product.slug}`}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <Card tone="surface" className="brand-divider flex h-full flex-col gap-4 pt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--text-dark)]">{product.segment}</p>
                <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">{product.name}</h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-[var(--castrol-green-dark)]">
                  {product.headline}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md border border-[rgba(30,42,35,0.14)] bg-[var(--off-white)] px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--muted-foreground)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span className="mt-auto inline-flex w-fit items-center px-0 py-0 text-sm font-semibold uppercase tracking-[0.1em] text-[var(--text-dark)] transition-colors duration-200 group-hover:text-[var(--castrol-green-deep)]">
                  View Product <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="Service Centers and Booking"
          title="Local branch coverage built around practical service booking"
          description="Georgian city-level access points with branch metadata, trust markers, and direct booking entry."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <Card tone="surface" className="space-y-5">
            <div className="flex flex-wrap gap-2">
              {["Tbilisi", "Batumi", "Kutaisi", "Rustavi"].map((city) => (
                <LinkButton
                  key={city}
                  href={`/service-centers?city=${city.toLowerCase()}`}
                  variant="ghost"
                  className="rounded-lg border border-[rgba(30,42,35,0.12)] bg-[var(--off-white)] px-3 py-2 text-[11px]"
                >
                  {city}
                </LinkButton>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {featuredCenters.map((center) => (
                <div key={center.slug} className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-red)]">{center.city}</p>
                  <h3 className="mt-2 text-sm font-semibold text-[var(--foreground)]">{center.name}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.12em] text-[var(--muted-foreground)]">{center.openingHours}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton
                href="/service-centers"
                className="!rounded-full !border-[#00b050] !bg-[#00a94a] !text-white !shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_18px_rgba(0,122,55,0.24)] hover:!translate-y-0 hover:!bg-[#00a94a] hover:!border-[#00b050] hover:!shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_8px_18px_rgba(0,122,55,0.24)]"
              >
                Explore Service Centers
              </LinkButton>
              <LinkButton href="/booking" variant="secondary">
                Book a Service Slot
              </LinkButton>
            </div>
          </Card>

          <Card tone="panel" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-red)]">Georgia Branch Focus</p>
            <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
              Trusted local servicing across high-demand city corridors
            </h3>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              Coordinate product selection with verified branch capacity and service pathways designed for Georgian driving conditions.
            </p>
            <div className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">Featured service attributes</p>
              <div className="mt-3 grid gap-2">
                {["Authorized technicians", "Product-family availability", "Booking priority windows"].map((item) => (
                  <div key={item} className="flex items-center gap-2 text-sm text-[var(--foreground)]">
                    <ShieldCheck className="h-4 w-4 text-[var(--castrol-green-deep)]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="About the Network"
          title="A local platform grounded in official distribution, service trust, and business readiness"
          description="This block emphasizes distributor credibility, authentic products, workshop standards, and long-term fleet support."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
          <Card tone="surface" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-red)]">Trust Foundations</p>
            <div className="space-y-2">
              {trustSignals.map((signal) => (
                <div key={signal} className="flex items-center gap-2 rounded-lg border border-[rgba(30,42,35,0.12)] bg-[var(--off-white)] px-3 py-2 text-sm">
                  <Building2 className="h-4 w-4 text-[var(--castrol-green-deep)]" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
            <LinkButton href="/about" variant="secondary" className="w-fit">
              About the Platform
            </LinkButton>
          </Card>

          <Card tone="panel" className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-red)]">Operating Metrics</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {localMetrics.map((metric) => (
                <div key={metric.label} className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white p-4 text-center">
                  <p className="font-display text-4xl uppercase tracking-[0.06em] text-[var(--castrol-green-deep)]">{metric.value}</p>
                  <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">{metric.label}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-[rgba(30,42,35,0.12)] bg-white p-4 text-sm leading-7 text-[var(--muted-foreground)]">
              Local support includes passenger service, workshop partnerships, and business customer pathways for fleet and transport operators.
            </div>
          </Card>
        </div>
      </section>

      <section className="space-y-6">
        <SectionHeading
          eyebrow="News and Insights"
          title="Promotions, maintenance intelligence, and local service advisories"
          description="Latest content strips in a concise newsroom layout with direct entry into article and campaign pages."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {insightCards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]"
            >
              <Card tone="surface" className="brand-divider flex h-full flex-col gap-4 pt-6">
                <p className="text-[13px] font-bold uppercase tracking-[0.18em] text-[var(--text-dark)]">{card.category}</p>
                <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">{card.title}</h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)] transition-colors duration-200 group-hover:text-[var(--castrol-green-dark)]">
                  {card.excerpt}
                </p>
                <p className="mt-auto inline-flex items-center whitespace-nowrap text-sm font-semibold uppercase tracking-[0.1em] text-[var(--foreground)] transition-colors duration-200 group-hover:text-[var(--castrol-green-deep)]">
                  Read More <ArrowRight className="ml-2 h-4 w-4" />
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
