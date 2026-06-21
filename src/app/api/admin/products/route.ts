import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";
import { requireApiSession } from "@/lib/auth/rbac";

export async function GET() {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const products = await prisma.product.findMany({
    include: { translations: true },
    orderBy: { sortOrder: "asc" },
  });
  return NextResponse.json({ products });
}

export async function POST(req: Request) {
  const guard = await requireApiSession();
  if (guard instanceof NextResponse) return guard;

  const body = (await req.json().catch(() => null)) as {
    key?: string;
    name?: string;
    status?: string;
    accentColor?: string;
  } | null;

  const key = body?.key?.trim();
  const name = body?.name?.trim();

  if (!key || !name) {
    return NextResponse.json({ error: "key এবং name উভয়ই আবশ্যক" }, { status: 400 });
  }

  try {
    const product = await prisma.product.create({
      data: {
        key,
        status: (body?.status as "LIVE" | "BUILDING" | "RESEARCH" | "ARCHIVED") ?? "RESEARCH",
        accentColor: body?.accentColor ?? "#17b79b",
        translations: { create: [{ locale: "en", name }] },
      },
      include: { translations: true },
    });
    return NextResponse.json({ product }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "এই key দিয়ে ইতোমধ্যে একটি Product আছে" }, { status: 409 });
  }
}
