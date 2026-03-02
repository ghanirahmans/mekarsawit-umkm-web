import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function PATCH(req: Request, { params }: { params: any }) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Await params if needed in future Next.js versions, currently params is an object in route handlers but let's be safe or just access via params.id
    // In Next.js 15+ params is async, but here we likely are on 14/15 transition.
    // The lint usually complains if we don't await, but for now treating as object if we can't await.
    // Actually, in standard Next.js route handlers `params` is available.

    const { id } = await params;
    const { isActive } = await req.json();

    const updatedCode = await prisma.villageCode.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error("Error updating village code:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui kode desa" },
      { status: 500 },
    );
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function DELETE(req: Request, { params }: { params: any }) {
  try {
    const admin = await getSessionAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.villageCode.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Kode berhasil dihapus" });
  } catch (error) {
    console.error("Error deleting village code:", error);
    return NextResponse.json(
      { error: "Gagal menghapus kode desa" },
      { status: 500 },
    );
  }
}
