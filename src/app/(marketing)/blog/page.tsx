import Link from "next/link";

import { Card, SectionHeading } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { blogPosts } from "@/lib/site-data";

export const metadata = buildMetadata({
  title: "Blog",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="page-shell space-y-8">
      <SectionHeading
        eyebrow="SEO Content"
        title="Blog listing template"
        description="Content-model-driven structure for guides, maintenance education, and campaign-supporting editorial content."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="space-y-4">
            <p className="text-xs uppercase tracking-[0.14em] text-white/82">
              {post.category} · {post.readTime}
            </p>
            <h2 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">{post.title}</h2>
            <p className="text-sm leading-7 text-[var(--muted-foreground)]">{post.excerpt}</p>
            <Link href={`/blog/${post.slug}`} className="text-sm font-semibold text-[var(--accent)] underline-offset-4 hover:underline">
              Read article
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
