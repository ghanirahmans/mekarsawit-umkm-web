import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUmkm } from "@/lib/auth";

// GET: Fetch product details
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUmkm();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Ensure product belongs to the logged-in UMKM
  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
  }

  return NextResponse.json(product);
}

// PUT: Update product
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUmkm();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { name, price, unit, stockStatus, description, imageUrl, active } = body;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
  }

  const updated = await prisma.product.update({
    where: { id },
    data: {
      name,
      price: parseInt(price),
      unit,
      stockStatus,
      description,
      imageUrl,
      active,
    },
  });

  return NextResponse.json({ ok: true, product: updated });
}

// DELETE: Delete product
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUmkm();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { business: true },
  });

  if (!product || product.business.ownerId !== user.id) {
    return NextResponse.json({ error: "Product not found or access denied" }, { status: 404 });
  }

  await prisma.product.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
