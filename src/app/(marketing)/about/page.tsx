import Link from "next/link";

import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "About",
  path: "/about",
});

export default function AboutPage() {
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
    </div>
  );
}
