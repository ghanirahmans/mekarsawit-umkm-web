import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    const codes = await prisma.villageCode.findMany({
      where: {
        code: {
          contains: q,
          mode: "insensitive",
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(codes);
  } catch (error) {
    console.error("Error fetching village codes:", error);
    return NextResponse.json(
      { error: "Gagal memuat kode desa" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { code, validFrom, validTo } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Kode desa wajib diisi" },
        { status: 400 },
      );
    }

    const existing = await prisma.villageCode.findUnique({
      where: { code },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Kode desa sudah ada" },
        { status: 400 },
      );
    }

    const newCode = await prisma.villageCode.create({
      data: {
        code,
        validFrom: validFrom ? new Date(validFrom) : new Date(),
        validTo: validTo ? new Date(validTo) : null,
        createdBy: admin.name || "Admin",
      },
    });

    return NextResponse.json(newCode);
  } catch (error) {
    console.error("Error creating village code:", error);
    return NextResponse.json(
      { error: "Gagal membuat kode desa" },
      { status: 500 },
    );
  }
}
