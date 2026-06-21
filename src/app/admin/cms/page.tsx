import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/auth/rbac";
import { CmsManager } from "@/components/admin/cms-manager";

export default async function AdminCmsPage() {
  await requireAdminSession();

  const [types, items] = await Promise.all([
    prisma.contentType.findMany({ orderBy: { name: "asc" } }),
    prisma.contentItem.findMany({
      include: { type: true, translations: true },
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">CMS</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Content types, items, and bilingual (en/bn) translations.
      </p>

      <CmsManager initialTypes={types} initialItems={items} />
    </div>
  );
}
