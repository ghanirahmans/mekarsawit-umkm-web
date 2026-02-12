import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session")?.value;
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = await prisma.user.findUnique({ where: { id: session } });
  if (admin?.role !== "super_admin")
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  try {
    const { id } = await params;
    const userId = id;

    // 1. Check if user exists
    const userToDelete = await prisma.user.findUnique({
      where: { id: userId },
      include: { businesses: true },
    });

    if (!userToDelete) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deleting self
    if (userToDelete.id === session) {
      return NextResponse.json(
        { error: "Cannot delete yourself" },
        { status: 400 },
      );
    }

    // 2. Manually delete associated data (simulating Cascade Delete)
    // Delete Products first
    for (const business of userToDelete.businesses) {
      await prisma.product.deleteMany({
        where: { businessId: business.id },
      });
    }

    // Delete Businesses
    await prisma.business.deleteMany({
      where: { ownerId: userId },
    });

    // 3. Delete User
    await prisma.user.delete({
      where: { id: userId },
    });

    // Redirect back to user list if called from form action (though here distinct API response is fine, we can use 303 for form submission compatibility if using pure HTML forms, but using next/navigation in client or revalidatePath is better. For simplicity of the form action in page.tsx, we can return a redirect if it was a form submission, but let's stick to standard API response and let the client handle it or use a Server Action.
    // Wait, the page.tsx uses a FORM ACTION with POST. So this route should probably handle resizing or we should use a Server Action.
    // Let's use standard Route Handler redirect pattern for form submissions.

    return NextResponse.redirect(new URL("/admin/users", req.url));
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
