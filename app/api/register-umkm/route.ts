import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { villageCode, phone, businessName, category, address, whatsapp, description } = body || {};

    if (!villageCode || !phone || !businessName || !category || !address || !whatsapp) {
      return NextResponse.json({ error: "Lengkapi semua field wajib." }, { status: 400 });
    }

    // Pastikan kode desa valid (dev atau yang aktif di tabel)
    const code = await prisma.villageCode.findFirst({
      where: { code: villageCode, isActive: true },
    });
    if (!code) {
      return NextResponse.json({ error: "Kode desa tidak valid atau tidak aktif." }, { status: 400 });
    }

    // Buat user jika belum ada
    const user = await prisma.user.upsert({
      where: { phone },
      update: { villageCode },
      create: {
        phone,
        villageCode,
        role: "umkm",
      },
    });

    // Buat business pending
    const slugBase = slugify(businessName);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const business = await prisma.business.create({
      data: {
        ownerId: user.id,
        name: businessName,
        slug,
        category,
        address,
        whatsapp,
        description,
        verified: false,
        active: false,
      },
    });

    return NextResponse.json({ ok: true, businessId: business.id, message: "Pendaftaran diterima. Menunggu verifikasi admin desa." });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Terjadi kesalahan server." }, { status: 500 });
  }
}
