import { randomUUID } from "crypto";

import { NextResponse } from "next/server";

import { createAffiliateRegistration } from "@/lib/affiliate-store";
import { registrationSubmissionSchema } from "@/lib/registration";
import { RegistrationMailConfigurationError, sendRegistrationNotification } from "@/lib/registration-mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid registration payload." }, { status: 400 });
  }

  const parsed = registrationSubmissionSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please complete the required registration fields." }, { status: 400 });
  }

  try {
    if (parsed.data.role === "affiliate") {
      const latitude = parsed.data.latitude;
      const longitude = parsed.data.longitude;

      if (typeof latitude !== "number" || !Number.isFinite(latitude) || typeof longitude !== "number" || !Number.isFinite(longitude)) {
        return NextResponse.json({ message: "Choose your service location on the map before registering." }, { status: 400 });
      }

      await createAffiliateRegistration({
        id: randomUUID(),
        role: "affiliate",
        username: parsed.data.username,
        email: parsed.data.email,
        serviceName: parsed.data.serviceName,
        address: parsed.data.address,
        phone: parsed.data.phone,
        googlePlaceId: parsed.data.googlePlaceId,
        latitude,
        longitude,
      });
    }

    await sendRegistrationNotification(parsed.data);
  } catch (error) {
    if (error instanceof RegistrationMailConfigurationError) {
      console.info("[account-registration]", error.message, parsed.data);

      return NextResponse.json({
        message:
          parsed.data.role === "affiliate"
            ? "Registration received. Your affiliate profile is pending admin approval."
            : "Registration received. Your account details were captured successfully.",
      });
    }

    console.error("[account-registration]", error);

    return NextResponse.json(
      { message: "Unable to send the registration request right now. Please try again in a moment." },
      { status: 500 },
    );
  }

  return NextResponse.json({
    message:
      parsed.data.role === "affiliate"
        ? "Registration received. Your affiliate profile is pending admin approval."
        : "Registration received. Your account details were captured successfully.",
  });
}
