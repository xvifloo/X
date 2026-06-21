import { prisma } from "@/lib/db/prisma";
import { requireAdminSession, FULL_ADMIN_ROLES } from "@/lib/auth/rbac";
import { SettingsManager } from "@/components/admin/settings-manager";

export default async function AdminSettingsPage() {
  await requireAdminSession(FULL_ADMIN_ROLES);

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });

  const shaped = settings.map((s: (typeof settings)[number]) => ({
    key: s.key,
    value: s.value as unknown,
    description: s.description,
    updatedAt: s.updatedAt.toISOString(),
  }));

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        সাইট-ব্যাপী কনফিগারেশন — key/value আকারে সংরক্ষিত, তাই নতুন সেটিং যোগ করতে কোনো migration লাগে না।
        শুধুমাত্র SUPERADMIN/ADMIN অ্যাক্সেস করতে পারবেন।
      </p>

      <SettingsManager initialSettings={shaped} />
    </div>
  );
}
