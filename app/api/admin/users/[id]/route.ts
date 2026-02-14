import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const admin = await getSessionAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id: userId } = await params;

    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: { businesses: true },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (userToDelete.id === admin.id) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 },
      );
    }

    for (const business of userToDelete.businesses) {
      await prisma.product.deleteMany({
        where: { businessId: business.id },
      });
    }

    await prisma.business.deleteMany({
      where: { ownerId: userId },
    });

    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.redirect(new URL("/admin/users", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
