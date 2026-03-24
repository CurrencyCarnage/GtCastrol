import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="About"
        title="Premium automotive maintenance platform"
        description="Castrol Georgia is positioned as a brand-led digital platform that connects product education, service trust, and conversion-ready user journeys."
      />
      <Card>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          The current build is the production-minded foundation: a premium frontend shell, typed domain models, catalogue routing, finder MVP, booking entry, and content templates prepared for future integrations.
        </p>
      </Card>
    </div>
  );
}
