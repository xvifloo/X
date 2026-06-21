import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";
import { ALL_ROLES, FULL_ADMIN_ROLES, ROLE } from "@/lib/auth/rbac";

// Only ADMIN/SUPERADMIN can view or manage the user list — EDITOR cannot.
export async function GET() {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;

  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: "desc" },
  });

  const shaped = users.map((u: (typeof users)[number]) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    image: u.image,
    status: u.status,
    createdAt: u.createdAt,
    roles: u.roles.map((r: { role: { name: string } }) => r.role.name),
  }));

  return NextResponse.json({ users: shaped, allRoles: ALL_ROLES });
}

export async function PATCH(req: Request) {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;
  const session = guard;

  const body = (await req.json().catch(() => null)) as {
    userId?: string;
    status?: "ACTIVE" | "SUSPENDED" | "DELETED";
    setRoles?: string[];
  } | null;

  if (!body?.userId) {
    return NextResponse.json({ error: "userId আবশ্যক" }, { status: 400 });
  }

  // Only a SUPERADMIN can grant or revoke the SUPERADMIN role itself, and
  // nobody can remove their own SUPERADMIN role (avoids accidental lockout).
  if (body.setRoles) {
    const grantingSuperadmin = body.setRoles.includes(ROLE.SUPERADMIN);
    const callerIsSuperadmin = (session.user?.roles ?? []).includes(ROLE.SUPERADMIN);
    if (grantingSuperadmin && !callerIsSuperadmin) {
      return NextResponse.json(
        { error: "শুধুমাত্র SUPERADMIN অন্য কাউকে SUPERADMIN বানাতে পারে" },
        { status: 403 },
      );
    }
    if (body.userId === session.user?.id && !grantingSuperadmin && callerIsSuperadmin) {
      return NextResponse.json(
        { error: "নিজের SUPERADMIN রোল নিজে থেকে সরানো যাবে না" },
        { status: 400 },
      );
    }
  }

  if (body.status) {
    await prisma.user.update({ where: { id: body.userId }, data: { status: body.status } });
  }

  if (body.setRoles) {
    const roleRows = await prisma.role.findMany({ where: { name: { in: body.setRoles } } });
    await prisma.userRole.deleteMany({ where: { userId: body.userId } });
    await prisma.userRole.createMany({
      data: roleRows.map((r: { id: string }) => ({ userId: body.userId!, roleId: r.id })),
      skipDuplicates: true,
    });
  }

  const user = await prisma.user.findUnique({
    where: { id: body.userId },
    include: { roles: { include: { role: true } } },
  });

  return NextResponse.json({
    user: user && {
      id: user.id,
      name: user.name,
      email: user.email,
      status: user.status,
      roles: user.roles.map((r: { role: { name: string } }) => r.role.name),
    },
  });
}
