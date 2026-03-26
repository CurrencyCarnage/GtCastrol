import { BookingForm } from "@/features/booking-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Booking",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="max-w-3xl space-y-4">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Booking MVP</p>
        <h1 className="font-display text-4xl uppercase tracking-[0.08em] text-[var(--foreground)] sm:text-5xl">
          Direct booking entry page
        </h1>
        <p className="text-base leading-8 text-[var(--muted-foreground)]">
          This is the first step in the booking architecture: direct branch selection today, product-led booking bridge next.
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
