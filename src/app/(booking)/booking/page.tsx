import Link from "next/link";

import { BookingForm } from "@/features/booking-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Booking",
  path: "/booking",
});

export default function BookingPage() {
  return (
    <div className="page-shell space-y-8">
      <div className="max-w-3xl space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
          <Link href="/" className="hover:underline">
            Home
          </Link>{" "}
          &gt; Booking
        </p>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--castrol-yellow)]">Booking MVP</p>
        <h1 className="font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-5xl">
          Direct booking entry page
        </h1>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">
          This is the first step in the booking architecture: direct branch selection today, product-led booking bridge next.
        </p>
      </div>
      <BookingForm />
    </div>
  );
}
