import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Contact",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="Contact"
        title="Lead capture and support page"
        description="Structured for future CRM-ready form submissions, service enquiries, and B2B lead capture."
      />
      <Card className="space-y-3">
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Phone: +995 599 00 10 10
        </p>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Email: hello@castrol-georgia.example.com
        </p>
        <p className="text-sm leading-7 text-[var(--muted-foreground)]">
          Tbilisi, Georgia
        </p>
      </Card>
    </div>
  );
}
