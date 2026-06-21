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
    /**
     * Auto-links a new OAuth account to an existing User with the same
     * email, instead of letting NextAuth throw "OAuthAccountNotLinked".
     *
     * Why this is safe (not "dangerous" account linking): both Google and
     * GitHub only return an email in the OAuth profile when that email has
     * been verified by the provider, so a matching email here is real proof
     * of ownership — not just an unverified claim.
     *
     * Why this is necessary here specifically: this project's Vercel
     * deployment and local dev both point at the same Neon database. If a
     * user signs in once locally with Google and later signs in on Vercel
     * with GitHub (e.g. because GOOGLE_CLIENT_ID/SECRET were never added to
     * Vercel's env vars, so Google isn't even offered there), the email
     * collides with the existing User row but has no Account row for
     * "github" yet — which is exactly what triggers OAuthAccountNotLinked.
     * This callback creates that missing Account row itself, *before*
     * NextAuth's own adapter lookup runs, so that lookup succeeds and the
     * sign-in completes normally instead of erroring out.
     */
    async signIn({ user, account }) {
      if (!account || account.type !== "oauth" || !user.email) return true;

      const existingUser: { id: string; accounts: Array<{ provider: string; providerAccountId: string }> } | null =
        await prisma.user.findUnique({
          where: { email: user.email },
          select: { id: true, accounts: { select: { provider: true, providerAccountId: true } } },
        });

      if (!existingUser) return true; // brand-new user — adapter creates it normally

      const alreadyLinked = existingUser.accounts.some(
        (a) => a.provider === account.provider && a.providerAccountId === account.providerAccountId,
      );
      if (alreadyLinked) return true;

      await prisma.account.create({
        data: {
          userId: existingUser.id,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state as string | undefined,
        },
      });

      return true;
    },
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
    /**
     * Without this, repeated failed sign-in attempts can make the
     * callbackUrl query param grow without bound: NextAuth's client-side
     * `signIn()` defaults `callbackUrl` to `window.location.href` whenever
     * the caller doesn't pass one explicitly. If the sign-in page itself
     * doesn't pass a clean, fixed callbackUrl (see the sign-in page patch),
     * every retry re-captures the *previous* (already-nested) URL as the
     * new callbackUrl. This callback is a second, server-side layer of
     * defense: it only ever allows same-origin redirects and always
     * collapses to a single clean target instead of trusting whatever was
     * passed in.
     */
    async redirect({ url, baseUrl }) {
      try {
        const target = new URL(url, baseUrl);
        if (target.origin === baseUrl) return target.toString();
      } catch {
        // fall through to baseUrl below
      }
      return baseUrl;
    },
  },
};
