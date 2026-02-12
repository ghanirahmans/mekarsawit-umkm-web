import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUmkm } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

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

  const business = await prisma.business.findUnique({
    where: { ownerId: user.id },
  });
  if (!business)
    return NextResponse.json({ error: "Business not found" }, { status: 404 });

  try {
    const formData = await req.formData();
    const name = formData.get("name") as string;
    const price = formData.get("price") as string;
    const unit = formData.get("unit") as string;
    const stockStatus = formData.get("stockStatus") as string;
    const description = formData.get("description") as string;
    const imageFile = formData.get("imageFile") as File | null;
    let imageUrl = formData.get("imageUrl") as string; // Allow fallback to URL if provided

    if (!name || !price || !unit) {
      return NextResponse.json(
        { error: "Nama, Harga, dan Satuan wajib diisi." },
        { status: 400 },
      );
    }

    // Handle File Upload
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      const filename = `${Date.now()}-${imageFile.name.replace(/\s/g, "-")}`;
      const uploadDir = path.join(process.cwd(), "public", "uploads");

      // Ensure directory exists (optional, but good practice if not guaranteed)
      // await mkdir(uploadDir, { recursive: true });

      const filePath = path.join(uploadDir, filename);
      await writeFile(filePath, buffer);
      imageUrl = `/uploads/${filename}`;
    }

    const slug = `${slugify(name)}-${Date.now().toString(36)}`;
    const priceInt = parseInt(price);

    const product = await prisma.product.create({
      data: {
        businessId: business.id,
        name,
        slug,
        price: priceInt,
        unit,
        stockStatus: stockStatus as "ready" | "preorder",
        description,
        imageUrl,
        active: true,
        verified: false,
      },
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Gagal menyimpan produk." },
      { status: 500 },
    );
  }
}
