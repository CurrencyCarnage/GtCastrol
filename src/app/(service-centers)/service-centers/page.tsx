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
      <SectionHeading
        eyebrow="Service Centers"
        title="Branch-aware locator foundation"
        description="Prepared for list-plus-map layouts, branch-specific services, trust markers, and inventory-aware booking."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {serviceCenters.map((center) => (
          <Card key={center.slug} className="space-y-4">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--accent)]">
                {center.city} / {center.district}
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
                {center.name}
              </h2>
            </div>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">
              {center.address} · {center.openingHours} · {center.phone}
            </p>
            <div className="flex flex-wrap gap-2">
              {center.trustBadges.map((badge) => (
                <span key={badge} className="rounded-full border border-white/10 px-3 py-1 text-xs text-[var(--muted-foreground)]">
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
