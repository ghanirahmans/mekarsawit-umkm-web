import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUmkm } from "@/lib/auth";
import { uploadFile } from "@/lib/storage";
import { logDebug } from "@/lib/logger";

export const runtime = "nodejs";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUmkm();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const business = await prisma.business.findUnique({
      where: { ownerId: user.id },
    });
    if (!business) {
      return NextResponse.json({ error: "Business not found" }, { status: 404 });
    }

    const formData = await req.formData();
    const nameRaw = formData.get("name");
    const priceRaw = formData.get("price");
    const unitRaw = formData.get("unit");
    const stockStatusRaw = formData.get("stockStatus");
    const descriptionRaw = formData.get("description");
    const imageEntry = formData.get("imageFile");

    const name = typeof nameRaw === "string" ? nameRaw.trim() : "";
    const price = typeof priceRaw === "string" ? priceRaw.trim() : "";
    const unit = typeof unitRaw === "string" ? unitRaw.trim() : "";
    const stockStatus =
      typeof stockStatusRaw === "string" ? stockStatusRaw.trim() : "";
    const description = typeof descriptionRaw === "string" ? descriptionRaw : "";

    if (!name || !price || !unit || !stockStatus) {
      return NextResponse.json(
        { error: "Nama, Harga, Satuan, dan Status Stok wajib diisi." },
        { status: 400 },
      );
    }

    if (stockStatus !== "ready" && stockStatus !== "preorder") {
      return NextResponse.json(
        { error: "Status stok tidak valid." },
        { status: 400 },
      );
    }

    const priceInt = Number(price);
    if (!Number.isInteger(priceInt) || priceInt <= 0) {
      return NextResponse.json({ error: "Harga tidak valid." }, { status: 400 });
    }

    let imageUrl: string | null = null;
    if (!(imageEntry instanceof File) || imageEntry.size === 0) {
      return NextResponse.json(
        { error: "Foto produk wajib diisi." },
        { status: 400 },
      );
    }

    const maxSize = 2 * 1024 * 1024;
    if (imageEntry.size > maxSize) {
      return NextResponse.json(
        { error: "Ukuran gambar maksimal 2MB." },
        { status: 400 },
      );
    }

    if (!imageEntry.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File harus berupa gambar." },
        { status: 400 },
      );
    }
    imageUrl = await uploadFile(imageEntry, "products");

    const slug = `${slugify(name)}-${Date.now().toString(36)}`;

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

    logDebug("product", {
      event: "create-success",
      productId: product.id,
      businessId: business.id,
      userId: user.id,
    });

    return NextResponse.json({ ok: true, product });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown-error";
    logDebug("product", { event: "create-failed", message });
    return NextResponse.json(
      { error: "Gagal menyimpan produk." },
      { status: 500 },
    );
  }
}
