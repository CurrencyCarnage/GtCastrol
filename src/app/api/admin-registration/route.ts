import { NextResponse } from "next/server";

import { createPendingAdminUser } from "@/lib/admin-auth";
import { adminRegistrationSchema } from "@/lib/admin-auth-schema";
import { AdminMailConfigurationError, sendAdminRegistrationConfirmationEmail } from "@/lib/admin-mail";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid admin registration payload." }, { status: 400 });
  }

  const parsed = adminRegistrationSchema.safeParse(payload);

  if (!parsed.success) {
    const passwordMatchError = parsed.error.issues.find((issue) => issue.path[0] === "confirmPassword");

    return NextResponse.json(
      { message: passwordMatchError?.message || "Please complete the required admin registration fields." },
      { status: 400 },
    );
  }

  try {
    const user = await createPendingAdminUser(parsed.data);
    const confirmationUrl = `${new URL(request.url).origin}/api/admin-registration/confirm?token=${user.confirmationToken}`;

    await sendAdminRegistrationConfirmationEmail({
      values: parsed.data,
      confirmationUrl,
    });

    return NextResponse.json({
      message:
        "Admin registration received. A confirmation email was sent to maisuradzetamazi1@gmail.com. The profile becomes active after confirmation.",
    });
  } catch (error) {
    if (error instanceof AdminMailConfigurationError) {
      return NextResponse.json(
        {
          message:
            "Admin registration was saved, but email sending is not configured yet. Configure SMTP to activate the confirmation email flow.",
        },
        { status: 500 },
      );
    }

    if (error instanceof Error) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    console.error("[admin-registration]", error);

    return NextResponse.json(
      { message: "Unable to process the admin registration right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
