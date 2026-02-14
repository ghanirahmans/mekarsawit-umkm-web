import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      villageCode,
      phone,
      businessName,
      category,
      address,
      whatsapp,
      description,
      password,
    } = body || {};

    if (
      !villageCode ||
      !phone ||
      !businessName ||
      !category ||
      !address ||
      !whatsapp ||
      !password
    ) {
      return NextResponse.json(
        { error: "Lengkapi semua field wajib." },
        { status: 400 },
      );
    }

    // Validate village code from database (admin-created codes only)
    const code = await prisma.villageCode.findFirst({
      where: { code: villageCode, isActive: true },
    });
    if (!code) {
      return NextResponse.json(
        { error: "Kode desa tidak valid atau tidak aktif." },
        { status: 400 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const slugBase = slugify(businessName);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    // Use transaction: invalidate code, generate new OTP, create user & business
    const result = await prisma.$transaction(async (tx) => {
      // 1. Invalidate the used village code (OTP-style)
      await tx.villageCode.update({
        where: { id: code.id },
        data: { isActive: false },
      });

      // 2. Auto-generate new village code (OTP replacement)
      const newCodeString = Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

      await tx.villageCode.create({
        data: {
          code: newCodeString,
          validFrom: new Date(),
          createdBy: "System (Auto-Reg)",
        },
      });

      // 3. Create or update user
      const user = await tx.user.upsert({
        where: { phone },
        update: { villageCode, passwordHash },
        create: {
          phone,
          villageCode,
          passwordHash,
          role: "admin_umkm",
        },
      });

      // 4. Create business pending approval
      const business = await tx.business.create({
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

      return { user, business };
    });

    return NextResponse.json({
      ok: true,
      businessId: result.business.id,
      message: "Pendaftaran diterima. Menunggu verifikasi admin desa.",
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
