import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = (await req.json().catch(() => null)) as {
    status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    translation?: { locale: "en" | "bn"; title: string; description?: string; body?: string };
  } | null;

  if (!body) {
    return NextResponse.json({ error: "অবৈধ রিকোয়েস্ট বডি" }, { status: 400 });
  }

  if (body.status) {
    await prisma.contentItem.update({
      where: { id },
      data: {
        status: body.status,
        publishedAt: body.status === "PUBLISHED" ? new Date() : undefined,
      },
    });
  }

  if (body.translation) {
    const { locale, title, description, body: bodyText } = body.translation;
    await prisma.contentTranslation.upsert({
      where: { itemId_locale: { itemId: id, locale } },
      update: { title, description, body: bodyText },
      create: { itemId: id, locale, title, description, body: bodyText },
    });
  }

  const item = await prisma.contentItem.findUnique({
    where: { id },
    include: { type: true, translations: true },
  });
  return NextResponse.json({ item });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  await prisma.contentItem.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
