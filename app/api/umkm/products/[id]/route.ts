import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUmkm } from "@/lib/auth";
import { uploadFile, deleteFile } from "@/lib/storage";

// GET: Fetch product details
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUmkm();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json(
      { error: "Product not found or access denied" },
      { status: 404 },
    );
  }

  return NextResponse.json(product);
}

// PUT: Update product (supports formData with file upload)
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUmkm();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json(
      { error: "Product not found or access denied" },
      { status: 404 },
    );
  }

  try {
    const contentType = req.headers.get("content-type") || "";
    let name: string | undefined;
    let price: string | undefined;
    let unit: string | undefined;
    let stockStatus: string | undefined;
    let description: string | undefined;
    let imageUrl: string | undefined;
    let active: boolean | undefined;
    let imageFile: File | null = null;

    if (contentType.includes("multipart/form-data")) {
      // FormData request (with possible file upload)
      const formData = await req.formData();
      name = (formData.get("name") as string) || undefined;
      price = (formData.get("price") as string) || undefined;
      unit = (formData.get("unit") as string) || undefined;
      stockStatus = (formData.get("stockStatus") as string) || undefined;
      description = (formData.get("description") as string) || undefined;
      const activeStr = formData.get("active") as string | null;
      if (activeStr !== null) active = activeStr === "true";
      imageFile = formData.get("imageFile") as File | null;
    } else {
      // JSON request (backward compatible)
      const body = await req.json();
      name = body.name;
      price = body.price;
      unit = body.unit;
      stockStatus = body.stockStatus;
      description = body.description;
      imageUrl = body.imageUrl;
      active = body.active;
    }

    // Handle new file upload
    if (imageFile && imageFile.size > 0) {
      // Delete old image from Supabase if exists
      if (product.imageUrl) {
        await deleteFile(product.imageUrl);
      }
      imageUrl = await uploadFile(imageFile, "products");
    }

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(price !== undefined && { price: parseInt(price) }),
        ...(unit !== undefined && { unit }),
        ...(stockStatus !== undefined && {
          stockStatus: stockStatus as "ready" | "preorder",
        }),
        ...(description !== undefined && { description }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json({ ok: true, product: updated });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Gagal mengupdate produk." },
      { status: 500 },
    );
  }
}

// DELETE: Delete product
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getSessionUmkm();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json(
      { error: "Product not found or access denied" },
      { status: 404 },
    );
  }

  // Delete image from Supabase Storage
  if (product.imageUrl) {
    await deleteFile(product.imageUrl);
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
