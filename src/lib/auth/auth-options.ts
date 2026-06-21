import type { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/db/prisma";

if (process.env.NODE_ENV !== "production") {
  process.env.NEXTAUTH_URL ||= "http://localhost:3000";
  process.env.NEXTAUTH_SECRET ||= "dev-secret-change-me";
}

const providers: NextAuthOptions["providers"] = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  );
}

// Email (magic link) login — only enabled when SMTP settings are provided.
// Uses the VerificationToken table that already exists in the Prisma schema
// for the adapter, so no schema change was needed for this provider.
if (process.env.EMAIL_SERVER && process.env.EMAIL_FROM) {
  providers.push(
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
      maxAge: 24 * 60 * 60, // magic link valid for 24h
    }),
  );
}

/** Fetches a user's current role names from the database. */
async function loadUserRoles(userId: string): Promise<string[]> {
  const rows: Array<{ role: { name: string } }> = await prisma.userRole.findMany({
    where: { userId },
    include: { role: true },
  });
  return rows.map((r) => r.role.name);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers,
  // JWT sessions (rather than database sessions) are required so that
  // Next.js middleware — which runs on the Edge runtime and cannot reach
  // Prisma/Postgres directly — can read the user's roles via getToken()
  // and protect /admin routes without an extra database round trip.
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // Roles are loaded once at sign-in and refreshed whenever the client
      // explicitly calls `update()` (e.g. right after an admin changes
      // their own roles) — not on every request, to avoid a DB hit per page.
      if (user?.id) {
        token.userId = user.id;
        token.roles = await loadUserRoles(user.id);
      } else if (trigger === "update" && token.userId) {
        token.roles = await loadUserRoles(token.userId as string);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.userId as string) ?? token.sub ?? "";
        session.user.roles = (token.roles as string[]) ?? [];
      }
      return session;
    },
  },
};
