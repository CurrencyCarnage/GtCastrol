import { NextResponse } from "next/server";

import { authenticateAdminUser } from "@/lib/admin-auth";
import { adminLoginSchema } from "@/lib/admin-auth-schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid admin login payload." }, { status: 400 });
  }

  const parsed = adminLoginSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json({ message: "Please enter your admin username/email and password." }, { status: 400 });
  }

  const result = await authenticateAdminUser(parsed.data);

  if (result.status === "pending") {
    return NextResponse.json(
      { message: "This admin account is pending email confirmation and is not active yet." },
      { status: 403 },
    );
  }

  if (result.status === "invalid") {
    return NextResponse.json({ message: "Invalid admin username/email or password." }, { status: 401 });
  }

  return NextResponse.json({
    message: `Admin login successful. Welcome, ${result.user.username}.`,
  });
}
