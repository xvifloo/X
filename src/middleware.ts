import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

import { ADMIN_AREA_ROLES, hasAnyRole } from "@/lib/auth/rbac-constants";

/**
 * Protects every /admin route. Runs on the Edge runtime, so it reads roles
 * straight out of the signed JWT (via getToken) instead of hitting Prisma —
 * this is the reason auth-options.ts uses session: { strategy: "jwt" }.
 *
 * This is the first line of defense. Each admin page/route handler also
 * re-checks the session server-side (see src/app/admin/layout.tsx and the
 * /api/admin/* route handlers) so that even if this file were ever
 * bypassed or misconfigured, access still can't be gained.
 */
export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const roles = (token?.roles as string[] | undefined) ?? [];
  const isAllowed = hasAnyRole(roles, ADMIN_AREA_ROLES);

  if (!isAllowed) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    // Pathname + search only (never the full request.url) — this is what
    // keeps callbackUrl a single clean value instead of letting it carry an
    // already-nested callbackUrl from a previous redirect.
    signInUrl.searchParams.set(
      "callbackUrl",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
