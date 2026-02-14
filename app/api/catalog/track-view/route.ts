import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { businessIds } = await req.json();

    if (
      !businessIds ||
      !Array.isArray(businessIds) ||
      businessIds.length === 0
    ) {
      return NextResponse.json(
        { error: "businessIds harus berupa array." },
        { status: 400 },
      );
    }

    // Batch increment viewCount for all visible businesses
    await prisma.business.updateMany({
      where: { id: { in: businessIds } },
      data: { viewCount: { increment: 1 } },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Track view error:", err);
    return NextResponse.json(
      { error: "Gagal mencatat view." },
      { status: 500 },
    );
  }
}
