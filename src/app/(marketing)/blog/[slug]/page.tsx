import { notFound } from "next/navigation";

import { Card } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";
import { blogPosts, getBlogPost } from "@/lib/site-data";

export async function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  return buildMetadata({
    title: post?.title ?? "Blog",
    description: post?.excerpt,
    path: `/blog/${slug}`,
  });
}

export default async function BlogDetailPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <div className="page-shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">{post.category}</p>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl">{post.title}</h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">{post.excerpt}</p>
      </div>
      <Card className="space-y-4">
        {post.body.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7 text-[var(--muted-foreground)]">
            {paragraph}
          </p>
        ))}
      </Card>
    </div>
  );
}
