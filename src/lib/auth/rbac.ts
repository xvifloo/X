import { getServerSession, type Session } from "next-auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { authOptions } from "@/lib/auth/auth-options";

/**
 * Role-Based Access Control (RBAC) — session-checking helpers.
 *
 * The constants (ROLE, ALL_ROLES, ADMIN_AREA_ROLES, etc.) and the pure
 * `hasAnyRole` function live in "@/lib/auth/rbac-constants" instead of here,
 * because that file must stay importable from src/middleware.ts (Edge
 * runtime). This file re-exports all of them so every existing import of
 * "@/lib/auth/rbac" across Server Components and Route Handlers keeps
 * working unchanged — only src/middleware.ts imports the constants module
 * directly.
 */
export {
  ROLE,
  ALL_ROLES,
  ADMIN_AREA_ROLES,
  FULL_ADMIN_ROLES,
  SUPERADMIN_ONLY_ROLES,
  hasAnyRole,
  type RoleName,
} from "@/lib/auth/rbac-constants";

import { ADMIN_AREA_ROLES as DEFAULT_ADMIN_ROLES, hasAnyRole as checkAnyRole } from "@/lib/auth/rbac-constants";
import type { RoleName as Role } from "@/lib/auth/rbac-constants";

/**
 * Server Component / layout guard. Redirects to sign-in if the current
 * session doesn't carry one of the allowed roles. This is the second layer
 * of defense behind src/middleware.ts (which only checks the JWT at the
 * edge); this one runs server-side on every render of a protected page.
 */
export async function requireAdminSession(allowed: Role[] = DEFAULT_ADMIN_ROLES): Promise<Session> {
  const session = await getServerSession(authOptions);
  if (!session?.user || !checkAnyRole(session.user.roles, allowed)) {
    redirect("/auth/sign-in?callbackUrl=/admin");
  }
  return session;
}

/**
 * Route Handler guard for /api/admin/* endpoints. Returns the session on
 * success, or a ready-to-return NextResponse with the correct status code
 * on failure — callers do:
 *   const result = await requireApiSession();
 *   if (result instanceof NextResponse) return result;
 *   const session = result;
 */
export async function requireApiSession(
  allowed: Role[] = DEFAULT_ADMIN_ROLES,
): Promise<Session | NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!checkAnyRole(session.user.roles, allowed)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}
