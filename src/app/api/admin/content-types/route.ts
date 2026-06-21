import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";

export async function GET() {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const types = await prisma.contentType.findMany({ orderBy: { name: "asc" } });
  return NextResponse.json({ types });
}

export async function POST(req: Request) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const body = (await req.json().catch(() => null)) as { key?: string; name?: string } | null;
  const key = body?.key?.trim();
  const name = body?.name?.trim();

  if (!key || !name) {
    return NextResponse.json({ error: "key এবং name উভয়ই আবশ্যক" }, { status: 400 });
  }

  try {
    const type = await prisma.contentType.create({ data: { key, name } });
    return NextResponse.json({ type }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "এই key দিয়ে ইতোমধ্যে একটি Content Type আছে" },
      { status: 409 },
    );
  }
}
