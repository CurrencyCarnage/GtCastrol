import { notFound } from "next/navigation";

import { LinkButton } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { campaignPages, getCampaign } from "@/lib/site-data";

export async function generateStaticParams() {
  return campaignPages.map((campaign) => ({ slug: campaign.slug }));
}

export async function generateMetadata(props: PageProps<"/campaigns/[slug]">) {
  const { slug } = await props.params;
  const campaign = getCampaign(slug);

  return buildMetadata({
    title: campaign?.title ?? "Campaign",
    description: campaign?.summary,
    path: `/campaigns/${slug}`,
  });
}

export default async function CampaignPage(props: PageProps<"/campaigns/[slug]">) {
  const { slug } = await props.params;
  const campaign = getCampaign(slug);

  if (!campaign) notFound();

  return (
    <div className="page-shell">
      <section className="hero-panel px-6 py-10 sm:px-10">
        <div className="max-w-3xl space-y-5">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Campaign landing page template</p>
          <h1 className="font-display text-5xl uppercase tracking-[0.08em] text-white">{campaign.title}</h1>
          <p className="text-base leading-8 text-[var(--muted-foreground)]">{campaign.summary}</p>
          <div className="flex flex-wrap gap-3">
            <LinkButton href="/booking">{campaign.ctaLabel}</LinkButton>
            <LinkButton href="/contact" variant="secondary">
              Contact team
            </LinkButton>
          </div>
        </div>
      </section>
    </div>
  );
}
