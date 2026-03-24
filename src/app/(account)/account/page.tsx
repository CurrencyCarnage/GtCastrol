import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account",
  path: "/account",
});

export default function AccountPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="Personal Account"
        title="Auth-ready account placeholder"
        description="Prepared for order history, saved vehicles, booking status, and B2B company profile flows."
      />
      <Card>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Authentication and personal account flows are intentionally deferred, but the route and information architecture are in place.
        </p>
      </Card>
    </div>
  );
}
