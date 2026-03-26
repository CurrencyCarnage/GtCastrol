import { FinderWizard } from "@/features/finder-wizard";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Product Finder",
  path: "/finder",
});

export default function FinderPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Recommendation engine surface</p>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-[var(--foreground)] sm:text-5xl">
          Product Finder MVP
        </h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">
          The finder is modelled as a recommendation flow, not a generic filter form. It is ready for future vehicle, year, inventory, and fallback logic.
        </p>
      </div>
      <FinderWizard />
    </div>
  );
}
