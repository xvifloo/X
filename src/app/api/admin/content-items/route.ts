import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";

export async function GET() {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const items = await prisma.contentItem.findMany({
    include: { type: true, translations: true, author: { select: { name: true, email: true } } },
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json({ items });
}

export async function POST(req: Request) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;
  const session = guard;

  const body = (await req.json().catch(() => null)) as {
    typeId?: string;
    slug?: string;
    title?: string;
  } | null;

  const typeId = body?.typeId?.trim();
  const slug = body?.slug?.trim();
  const title = body?.title?.trim();

  if (!typeId || !slug || !title) {
    return NextResponse.json(
      { error: "typeId, slug এবং title (ইংরেজি) আবশ্যক" },
      { status: 400 },
    );
  }

  try {
    const item = await prisma.contentItem.create({
      data: {
        typeId,
        slug,
        authorId: session.user?.id,
        translations: {
          create: [{ locale: "en", title }],
        },
      },
      include: { type: true, translations: true },
    });
    return NextResponse.json({ item }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "এই slug দিয়ে এই Content Type-এ ইতোমধ্যে একটি আইটেম আছে" },
      { status: 409 },
    );
  }
}
