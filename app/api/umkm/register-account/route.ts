import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { uploadFile } from "@/lib/storage";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    // User Data
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;
    const villageCode = formData.get("villageCode") as string;

    // Business Data
    const businessName = formData.get("businessName") as string;
    const category = formData.get("category") as string;
    const address = formData.get("address") as string;
    const whatsapp = formData.get("whatsapp") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("imageFile") as File | null;

    // Basic Validation
    if (
      !name ||
      !phone ||
      !password ||
      !villageCode ||
      !businessName ||
      !category ||
      !address ||
      !whatsapp
    ) {
      return NextResponse.json(
        { error: "Harap lengkapi semua data wajib (akun & usaha)." },
        { status: 400 },
      );
    }

    // 1. Validate Village Code from database (admin-created codes only)
    const code = await prisma.villageCode.findFirst({
      where: { code: villageCode, isActive: true },
    });
    if (!code) {
      return NextResponse.json(
        { error: "Kode desa tidak valid atau tidak aktif." },
        { status: 400 },
      );
    }

    // 2. Check Existing User
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "Nomor HP sudah terdaftar." },
        { status: 400 },
      );
    }

    // 3. Handle Image Upload (Supabase Storage)
    let coverImageUrl = null;
    if (imageFile && imageFile.size > 0) {
      coverImageUrl = await uploadFile(imageFile, "business");
    }

    // 4. Create User & Business in Transaction
    const passwordHash = await bcrypt.hash(password, 10);
    const slugBase = slugify(businessName);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Invalidate the used Village Code (OTP-style)
      await tx.villageCode.update({
        where: { id: code.id },
        data: { isActive: false },
      });

      // 2. Auto-generate New Village Code (OTP replacement)
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

      // 3. Create User
      const user = await tx.user.create({
        data: {
          name,
          phone,
          villageCode,
          passwordHash,
          role: "admin_umkm",
        },
      });

      // 4. Create Business linked to User
      await tx.business.create({
        data: {
          ownerId: user.id,
          name: businessName,
          slug,
          category,
          address,
          whatsapp,
          description,
          coverImageUrl,
          verified: false,
          active: false,
        },
      });

      return user;
    });

    const response = NextResponse.json({
      ok: true,
      message: "Akun dan Usaha berhasil didaftarkan! Mengalihkan...",
    });

    // Auto-login: Set Session Cookie
    if (newUser) {
      response.cookies.set("umkm_session", newUser.id, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
    }

    return response;
  } catch (err: any) {
    console.error("Registration Error:", err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server saat pendaftaran." },
      { status: 500 },
    );
  }
}
