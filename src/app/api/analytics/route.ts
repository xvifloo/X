import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

type JsonPrimitive = string | number | boolean | null;
type JsonObject = { [key: string]: JsonValue };
type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as null | {
    eventName?: string;
    props?: JsonObject;
    path?: string;
    referrer?: string | null;
    locale?: string | null;
    anonymousId?: string | null;
  };

  const eventName = body?.eventName?.trim();
  if (!eventName) {
    return NextResponse.json({ ok: false, error: "Missing eventName" }, { status: 400 });
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        eventName,
        anonymousId: body?.anonymousId ?? null,
        path: body?.path ?? null,
        referrer: body?.referrer ?? null,
        locale: body?.locale ?? null,
        props: body?.props ?? undefined,
      },
    });
  } catch {
    // Allow the app to function without a configured database.
    return NextResponse.json({ ok: true, persisted: false });
  }

  return NextResponse.json({ ok: true, persisted: true });
}
