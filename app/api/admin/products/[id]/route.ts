import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }, // Fix for Next.js 15 async params
) {
  const admin = await getSessionAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();
  const { action } = body;

  try {
    if (action === "approve") {
      await prisma.product.update({
        where: { id },
        data: { verified: true },
      });
    } else if (action === "reject") {
      //   await prisma.product.update({
      //     where: { id },
      //     data: { active: false }, // Or delete? Let's just hide it for now or delete it.
      //   });
      await prisma.product.delete({
        where: { id },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses" }, { status: 500 });
  }
}
