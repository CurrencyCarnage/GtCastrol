import { NextResponse } from "next/server";

import { listAffiliateRegistrations } from "@/lib/affiliate-store";

export const runtime = "nodejs";

export async function GET() {
  const affiliates = await listAffiliateRegistrations();
  return NextResponse.json({ affiliates });
}
