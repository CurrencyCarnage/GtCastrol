import Link from "next/link";
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
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt;{" "}
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>{" "}
          &gt; {post.title}
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--castrol-yellow)]">{post.category}</p>
        <h1 className="font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-5xl">
          {post.title}
        </h1>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">{post.excerpt}</p>
      </div>
      <Card className="brand-divider space-y-4 pt-6">
        {post.body.map((paragraph) => (
          <p key={paragraph} className="text-sm leading-7 text-white/84">
            {paragraph}
          </p>
        ))}
      </Card>
    </div>
  );
}
