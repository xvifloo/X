import { prisma } from "@/lib/db/prisma";
import { requireAdminSession } from "@/lib/auth/rbac";
import { ProductsManager } from "@/components/admin/products-manager";

export default async function AdminProductsPage() {
  await requireAdminSession();

  const products = await prisma.product.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="max-w-5xl">
      <h1 className="font-heading text-2xl font-semibold tracking-tight">Products</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        The ecosystem&apos;s products — status, accent color, and bilingual copy.
      </p>

      <ProductsManager initialProducts={products} />
    </div>
  );
}
