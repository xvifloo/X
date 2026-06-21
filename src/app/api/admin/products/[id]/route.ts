import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    status?: "LIVE" | "BUILDING" | "RESEARCH" | "ARCHIVED";
    accentColor?: string;
    externalUrl?: string;
    sortOrder?: number;
    translation?: { locale: "en" | "bn"; name: string; tagline?: string; description?: string };
  } | null;

  if (!body) {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট বডি" }, { status: 400 });
  }

  const { translation, ...productFields } = body;

  if (Object.keys(productFields).length > 0) {
    await prisma.product.update({ where: { id }, data: productFields });
  }

  if (translation) {
    const { locale, name, tagline, description } = translation;
    await prisma.productTranslation.upsert({
      where: { productId_locale: { productId: id, locale } },
      update: { name, tagline, description },
      create: { productId: id, locale, name, tagline, description },
    });
  }

  const product = await prisma.product.findUnique({
    where: { id },
    include: { translations: true },
  });
  return NextResponse.json({ product });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
