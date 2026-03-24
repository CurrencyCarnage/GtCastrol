import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { getLegalPage, legalPages } from "@/lib/site-data";

export async function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const page = getLegalPage(slug);

  return buildMetadata({
    title: page?.title ?? "Legal",
    description: page?.summary,
    path: `/legal/${slug}`,
  });
}

export default async function LegalPage(props: PageProps<"/legal/[slug]">) {
  const { slug } = await props.params;
  const page = getLegalPage(slug);

  if (!page) notFound();

  return (
    <div className="page-shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Legal</p>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl">{page.title}</h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">{page.summary}</p>
      </div>
      <div className="space-y-4">
        {page.sections.map((section) => (
          <Card key={section.heading} className="space-y-3">
            <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-white">{section.heading}</h2>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">{section.body}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
