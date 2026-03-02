import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";
import { logAuth } from "@/lib/logger";

export async function GET(req: Request) {
  const admin = await getSessionAdmin();
  if (!admin) {
    logAuth({
      event: "village-codes-unauthorized",
      cookieHeaderPresent: !!req.headers.get("cookie"),
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";

  const codes = await prisma.villageCode.findMany({
    where: {
      code: {
        contains: query,
        mode: "insensitive",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = codes.map((code: any) => ({
    ...code,
    createdAt: code.createdAt.toISOString(),
    createdBy: code.createdBy || "Admin",
  }));

  return NextResponse.json(serialized);
}

export async function POST(req: Request) {
  const admin = await getSessionAdmin();
  if (!admin) {
    logAuth({
      event: "village-codes-create-unauthorized",
      cookieHeaderPresent: !!req.headers.get("cookie"),
    });
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const code = (body?.code as string | undefined)?.trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Kode wajib diisi" }, { status: 400 });
  }

  const existing = await prisma.villageCode.findUnique({ where: { code } });
  if (existing) {
    return NextResponse.json({ error: "Kode sudah ada" }, { status: 400 });
  }

  await prisma.villageCode.create({
    data: {
      code,
      validFrom: new Date(),
      createdBy: admin.name || "Admin",
    },
  });

  return NextResponse.json({ ok: true });
}
