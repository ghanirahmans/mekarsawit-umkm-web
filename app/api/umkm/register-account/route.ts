import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

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

    // 1. Validate Village Code
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

    // 3. Handle Image Upload
    let coverImageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `biz-${Date.now()}-${imageFile.name.replace(/\s/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Ensure directory exists? (Assuming it does based on previous code)
      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      coverImageUrl = `/uploads/${filename}`;
    }

    // 4. Create User & Business in Transaction
    const passwordHash = await bcrypt.hash(password, 10);
    const slugBase = slugify(businessName);
    const slug = `${slugBase}-${Date.now().toString(36)}`;

    // Using transaction to ensure atomic creation
    const newUser = await prisma.$transaction(async (tx) => {
      // 1. Invalidate the used Village Code
      await tx.villageCode.update({
        where: { id: code.id },
        data: { isActive: false },
      });

      // 2. Auto-generate New Village Code
      // Format: 10 random alphanumeric characters
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
          villageCode, // Keep record of which code was used
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
          active: false, // Wait for approval
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
