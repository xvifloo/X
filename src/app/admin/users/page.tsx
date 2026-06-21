import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, FULL_ADMIN_ROLES, ALL_ROLES } from "@/lib/auth/rbac";
import { UsersManager } from "@/components/admin/users-manager";

export default async function AdminUsersPage() {
  const session = await requireAdminSession(FULL_ADMIN_ROLES);

  const users = await prisma.user.findMany({
    include: { roles: { include: { role: true } } },
    orderBy: { createdAt: "desc" },
  });

  const shaped = users.map((u: (typeof users)[number]) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    status: u.status,
    roles: u.roles.map((r: { role: { name: string } }) => r.role.name),
  }));

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Users</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Manage account status and role assignments. SUPERADMIN/ADMIN only.
      </p>

      <UsersManager initialUsers={shaped} allRoles={[...ALL_ROLES]} currentUserId={session.user!.id} />
    </div>
  );
}
