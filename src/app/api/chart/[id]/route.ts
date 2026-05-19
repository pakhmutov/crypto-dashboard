import { NextRequest, NextResponse } from "next/server";
import { getCoinOHLC } from "@/lib/coingecko";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const days = Number(req.nextUrl.searchParams.get("days") ?? "7");

  try {
    const data = await getCoinOHLC(id, days);
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
