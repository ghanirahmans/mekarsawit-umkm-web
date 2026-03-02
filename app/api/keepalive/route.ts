import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Memberikan peluang (probabilitas) acak 50% untuk benar-benar mengeksekusi hit ke DB.
    // Jika endpoint ini di-hit, misal 6 kali sehari oleh cron-job.org, 
    // secara acak rata-rata akan lolos mengeksekusi DB 2 sampai 4 kali sehari.
    const isHitDatabase = Math.random() < 0.5;

    if (!isHitDatabase) {
      return NextResponse.json(
        { message: "Skipped database hit this time to randomize usage" },
        { status: 200 }
      );
    }

    // 1. Hit pertama ke database: mengambil jumlah user
    const userCount = await prisma.user.count();

    // 2. Hit kedua ke database: mengambil jumlah bisnis/UMKM
    const businessCount = await prisma.business.count();

    return NextResponse.json(
      {
        message: "Database connections kept alive successfully",
        stats: {
          users: userCount,
          businesses: businessCount,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Keep-alive error:", error);
    return NextResponse.json(
      {
        message: "Failed to keep database alive",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
