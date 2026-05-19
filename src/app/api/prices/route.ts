import { NextRequest, NextResponse } from "next/server";
import { getCoinsByIds } from "@/lib/coingecko";

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get("ids");
  if (!ids) return NextResponse.json([]);

  try {
    const coins = await getCoinsByIds(ids.split(",").filter(Boolean));
    return NextResponse.json(coins);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch prices" },
      { status: 500 }
    );
  }
}
