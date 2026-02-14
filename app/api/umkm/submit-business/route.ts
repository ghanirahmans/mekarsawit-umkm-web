import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUmkm } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { normalizePhoneNumber } from "@/lib/wa";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  const user = await getSessionUmkm();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const businessName = formData.get("businessName") as string;
    const category = formData.get("category") as string;
    const address = formData.get("address") as string;
    const rawWhatsapp = formData.get("whatsapp") as string;
    const whatsapp = normalizePhoneNumber(rawWhatsapp);
    const description = formData.get("description") as string;
    const imageFile = formData.get("imageFile") as File | null;

    if (!businessName || !category || !address || !whatsapp) {
      return NextResponse.json(
        { error: "Lengkapi semua field wajib." },
        { status: 400 },
      );
    }

    const existingBusiness = await prisma.business.findUnique({
      where: { ownerId: user.id },
    });

    if (existingBusiness) {
      return NextResponse.json(
        { error: "Anda sudah memiliki usaha terdaftar." },
        { status: 400 },
      );
    }

    let coverImageUrl = null;
    if (imageFile && imageFile.size > 0) {
      coverImageUrl = await uploadFile(imageFile, "business");
    }

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
        coverImageUrl,
        verified: false,
        active: false,
      },
    });

    return NextResponse.json({ ok: true, business });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
