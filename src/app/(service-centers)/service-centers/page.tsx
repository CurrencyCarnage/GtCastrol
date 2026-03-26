import Link from "next/link";

import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { serviceCenters } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Service Centers",
  path: "/service-centers",
});

export default function ServiceCentersPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; Service Centers
        </p>
        <SectionHeading
          eyebrow="Service Centers"
          title="Branch-aware locator foundation"
          description="Prepared for list-plus-map layouts, branch-specific services, trust markers, and inventory-aware booking."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {serviceCenters.map((center) => (
          <Card key={center.slug} className="brand-divider space-y-4 pt-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">
                {center.city} / {center.district}
              </p>
              <h2 className="mt-2 font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">
                {center.name}
              </h2>
            </div>
            <p className="text-sm leading-7 text-white/84">
              {center.address} - {center.openingHours} - {center.phone}
            </p>
            <div className="flex flex-wrap gap-2">
              {center.trustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/84">
                  {badge}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
