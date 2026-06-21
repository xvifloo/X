/**
 * Pure RBAC constants + helpers — deliberately has ZERO imports from
 * "next-auth" or "next/navigation". This file is safe to import from
 * src/middleware.ts, which runs on the Edge runtime: the full "next-auth"
 * package (pulled in by getServerSession) uses dynamic code evaluation that
 * the Edge runtime rejects at build time. Server Components and Route
 * Handlers (Node runtime) should keep importing from "@/lib/auth/rbac",
 * which re-exports everything here plus the session-checking helpers.
 */

export const ROLE = {
  SUPERADMIN: "SUPERADMIN",
  ADMIN: "ADMIN",
  EDITOR: "EDITOR",
  USER: "USER",
} as const;

export type RoleName = (typeof ROLE)[keyof typeof ROLE];

export const ALL_ROLES: RoleName[] = [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.EDITOR, ROLE.USER];

/** Roles allowed to enter the /admin area at all (checked by middleware). */
export const ADMIN_AREA_ROLES: RoleName[] = [ROLE.SUPERADMIN, ROLE.ADMIN, ROLE.EDITOR];

/** Roles allowed to manage users, roles, products, and site settings. */
export const FULL_ADMIN_ROLES: RoleName[] = [ROLE.SUPERADMIN, ROLE.ADMIN];

/** Only the SUPERADMIN can grant/revoke the SUPERADMIN role itself. */
export const SUPERADMIN_ONLY_ROLES: RoleName[] = [ROLE.SUPERADMIN];

export function hasAnyRole(userRoles: string[] | undefined | null, allowed: RoleName[]): boolean {
  if (!userRoles || userRoles.length === 0) return false;
  return userRoles.some((r) => allowed.includes(r as RoleName));
}
