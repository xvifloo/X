import Link from "next/link";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth/auth-options";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  return (
    <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
      <p className="mt-2 text-muted-foreground">
        This is the admin area scaffold. RBAC + CMS screens will be implemented phase-by-phase.
      </p>

      <div className="mt-6 rounded-lg border p-4">
        <p className="text-sm">
          <span className="font-medium">Session:</span>{" "}
          {session?.user?.email ? session.user.email : "Not signed in"}
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Go to <Link className="underline" href="/auth/sign-in">Sign in</Link>.
        </p>
      </div>
    </main>
  );
}

