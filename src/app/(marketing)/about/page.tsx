import { Factory, ShieldCheck, ShoppingBag } from "lucide-react";
import Link from "next/link";

import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { serviceCenters } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "About",
  path: "/about",
});

const trustSignals = [
  { title: "Official product pathways", description: "Catalogue and recommendations are built around Castrol product families.", Icon: ShoppingBag },
  { title: "Authorized local network", description: "Service routes connect users to Georgian centers and approved affiliate partners.", Icon: ShieldCheck },
  { title: "Business-ready support", description: "Passenger, workshop, and fleet flows share one platform foundation.", Icon: Factory },
] as const;

export default function AboutPage() {
  const cityCount = new Set(serviceCenters.map((center) => center.city)).size;

  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; About
        </p>
        <SectionHeading
          eyebrow="About"
          title="Premium automotive maintenance platform"
          description="This platform is positioned as a brand-led digital surface that connects product education, service trust, and conversion-ready user journeys."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
      </div>

      <Card className="brand-divider pt-6">
        <p className="text-sm leading-7 text-white/84">
          The current build is the production-minded foundation: a premium frontend shell, typed domain models, catalogue routing, finder MVP, booking entry, and content templates prepared for future integrations.
        </p>
      </Card>

      <section className="grid gap-6 rounded-[2rem] border border-[rgba(30,42,35,0.12)] bg-white p-6 shadow-[0_18px_44px_rgba(30,42,35,0.08)] sm:p-8 lg:grid-cols-[0.92fr_1.08fr] lg:p-10">
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--castrol-green-deep)]">Why Castrol Georgia</p>
          <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
            Official products, authorized service, local coverage.
          </h2>
          <p className="max-w-xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">
            The platform keeps product discovery, service availability, and partner readiness connected around real Georgian customer journeys.
          </p>

          <div className="grid max-w-lg grid-cols-3 gap-3 pt-2">
            <div>
              <p className="font-display text-4xl uppercase tracking-[0.06em] text-[var(--castrol-green-deep)]">{cityCount}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Cities</p>
            </div>
            <div>
              <p className="font-display text-4xl uppercase tracking-[0.06em] text-[var(--castrol-green-deep)]">8</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Families</p>
            </div>
            <div>
              <p className="font-display text-4xl uppercase tracking-[0.06em] text-[var(--castrol-green-deep)]">30+</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--muted-foreground)]">Routes</p>
            </div>
          </div>
        </div>

        <div className="grid gap-3">
          {trustSignals.map(({ title, description, Icon }) => (
            <div key={title} className="flex gap-4 rounded-[1.25rem] bg-[var(--off-white)] p-4">
              <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[var(--castrol-green-deep)] shadow-[0_6px_16px_rgba(30,42,35,0.06)]">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--foreground)]">{title}</h3>
                <p className="mt-1 text-sm leading-6 text-[var(--muted-foreground)]">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
