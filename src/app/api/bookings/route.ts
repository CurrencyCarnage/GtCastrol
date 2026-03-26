import { NextResponse } from "next/server";

import { bookingSubmissionSchema } from "@/lib/booking";
import { BookingMailConfigurationError, sendBookingNotification } from "@/lib/booking-mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid booking payload." }, { status: 400 });
  }

  const parsed = bookingSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Please complete the required booking fields before reserving service." },
      { status: 400 },
    );
  }

  try {
    await sendBookingNotification(parsed.data);

    return NextResponse.json({
      message: "Booking request sent. Our team has been notified and will follow up shortly.",
    });
  } catch (error) {
    if (error instanceof BookingMailConfigurationError) {
      return NextResponse.json({ message: error.message }, { status: 500 });
    }

    console.error("[booking-email]", error);

    return NextResponse.json(
      { message: "Unable to send the booking email right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
