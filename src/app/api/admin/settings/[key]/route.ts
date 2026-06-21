import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession, FULL_ADMIN_ROLES } from "@/lib/auth/rbac";
import { toPrismaJson, type JsonValue } from "@/lib/json";

type Params = { params: Promise<{ key: string }> };

export async function PATCH(req: Request, { params }: Params) {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;
  const session = guard;

  const { key } = await params;
  const body = (await req.json().catch(() => null)) as {
    value?: JsonValue;
    description?: string;
  } | null;

  if (!body || body.value === undefined) {
    return NextResponse.json({ error: "value আবশ্যক" }, { status: 400 });
  }

  const setting = await prisma.siteSetting.update({
    where: { key },
    data: {
      value: toPrismaJson(body.value),
      description: body.description,
      updatedById: session.user?.id,
    },
  });

  return NextResponse.json({ setting });
}

export async function DELETE(_req: Request, { params }: Params) {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;

  const { key } = await params;
  await prisma.siteSetting.delete({ where: { key } });
  return NextResponse.json({ ok: true });
}
