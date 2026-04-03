import { NextResponse } from "next/server";

import { approveAffiliateRegistration } from "@/lib/affiliate-store";

export const runtime = "nodejs";

export async function POST(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const affiliate = await approveAffiliateRegistration(id);
  return NextResponse.json({ affiliate });
}
