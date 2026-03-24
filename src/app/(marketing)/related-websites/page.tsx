import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Related Websites",
  path: "/related-websites",
});

export default function RelatedWebsitesPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="Related Websites"
        title="Partner and ecosystem links"
        description="Placeholder page for international Castrol properties, campaign partners, and future dealer or workshop network links."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {["Castrol Global", "Castrol Product Data", "Workshop Partner Portal"].map((item) => (
          <Card key={item}>
            <h2 className="font-display text-xl uppercase tracking-[0.08em] text-white">{item}</h2>
          </Card>
        ))}
      </div>
    </div>
  );
}
