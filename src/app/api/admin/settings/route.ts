import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession, FULL_ADMIN_ROLES } from "@/lib/auth/rbac";
import { toPrismaJson, type JsonValue } from "@/lib/json";

// Site settings are sensitive (they control site-wide behaviour), so only
// SUPERADMIN/ADMIN — not EDITOR — may read or write them.
export async function GET() {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;

  const settings = await prisma.siteSetting.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json({ settings });
}

export async function POST(req: Request) {
  const guard = await requireApiSession(FULL_ADMIN_ROLES);
  if (guard instanceof NextResponse) return guard;
  const session = guard;

  const body = (await req.json().catch(() => null)) as {
    key?: string;
    value?: JsonValue;
    description?: string;
  } | null;

  const key = body?.key?.trim();
  if (!key) {
    return NextResponse.json({ error: "key আবশ্যক" }, { status: 400 });
  }
  if (body?.value === undefined) {
    return NextResponse.json({ error: "value আবশ্যক" }, { status: 400 });
  }

  try {
    const setting = await prisma.siteSetting.create({
      data: {
        key,
        value: toPrismaJson(body.value),
        description: body.description,
        updatedById: session.user?.id,
      },
    });
    return NextResponse.json({ setting }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "এই key দিয়ে ইতোমধ্যে একটি Setting আছে" }, { status: 409 });
  }
}
