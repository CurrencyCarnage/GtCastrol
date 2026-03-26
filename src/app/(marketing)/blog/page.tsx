import Link from "next/link";
import { ArrowRight } from "lucide-react";

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
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; Blog
        </p>
        <SectionHeading
          eyebrow="SEO Content"
          title="Blog listing template"
          description="Content-model-driven structure for guides, maintenance education, and campaign-supporting editorial content."
          titleClassName="font-sans font-extrabold leading-[0.96] tracking-[0.02em]"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {blogPosts.map((post) => (
          <Card key={post.slug} className="brand-divider flex h-full flex-col gap-4 pt-6">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-yellow)]">
              {post.category} - {post.readTime}
            </p>
            <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">
              {post.title}
            </h2>
            <p className="text-sm leading-7 text-white/84">{post.excerpt}</p>
            <Link
              href={`/blog/${post.slug}`}
              className="mt-auto inline-flex w-fit items-center whitespace-nowrap text-sm font-semibold uppercase tracking-[0.1em] !text-white visited:!text-white transition hover:!text-white/88"
            >
              Read article <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
