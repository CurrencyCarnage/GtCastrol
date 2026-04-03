import { NextResponse } from "next/server";

import { activateAdminUser } from "@/lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token")?.trim();

  if (!token) {
    return new NextResponse("Missing confirmation token.", { status: 400 });
  }

  const user = await activateAdminUser(token);

  if (!user) {
    return new NextResponse("This confirmation link is invalid or has already been used.", { status: 400 });
  }

  return new NextResponse(
    `Admin account for ${user.username} is now active. You can return to /adminaccount and sign in.`,
    { status: 200 },
  );
}
