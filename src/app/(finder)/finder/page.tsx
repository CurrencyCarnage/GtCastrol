import Link from "next/link";

import { FinderWizard } from "@/features/finder-wizard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Product Finder",
  path: "/finder",
});

export default function FinderPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; Product Finder
        </p>
        <h1 className="font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] md:whitespace-nowrap lg:text-5xl">
          Find the right Castrol products
        </h1>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">
          Type to search by make or model, or use structured filters to keep the service list on the right continuously updated.
        </p>
      </div>
      <FinderWizard />
    </div>
  );
}
