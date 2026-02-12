import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { villageCode, phone, password, name } = body || {};

    if (!villageCode || !phone || !password || !name) {
      return NextResponse.json(
        { error: "Lengkapi semua field wajib." },
        { status: 400 },
      );
    }

    // Pastikan kode desa valid (dev atau yang aktif di tabel)
    const code = await prisma.villageCode.findFirst({
      where: { code: villageCode, isActive: true },
    });
    if (!code) {
      return NextResponse.json(
        { error: "Kode desa tidak valid atau tidak aktif." },
        { status: 400 },
      );
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Cek apakah nomor HP sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { phone },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Nomor HP sudah terdaftar." },
        { status: 400 },
      );
    }

    // Buat user baru
    await prisma.user.create({
      data: {
        name,
        phone,
        villageCode,
        passwordHash,
        role: "admin_umkm",
      },
    });

    return NextResponse.json({
      ok: true,
      message: "Akun berhasil dibuat. Silakan login untuk melanjutkan.",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
