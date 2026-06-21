"use client";

import * as React from "react";

type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  status: UserStatus;
  roles: string[];
};

const STATUS_STYLE: Record<UserStatus, string> = {
  ACTIVE: "bg-[var(--brand-muted)] text-[var(--brand)]",
  SUSPENDED: "bg-amber-500/10 text-amber-600",
  DELETED: "bg-destructive/10 text-destructive",
};

export function UsersManager({
  initialUsers,
  allRoles,
  currentUserId,
}: {
  initialUsers: AdminUser[];
  allRoles: string[];
  currentUserId: string;
}) {
  const [users, setUsers] = React.useState(initialUsers);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [savingId, setSavingId] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [draftRoles, setDraftRoles] = React.useState<string[]>([]);

  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (u.name ?? "").toLowerCase().includes(q) || (u.email ?? "").toLowerCase().includes(q);
  });

  const startEditing = (user: AdminUser) => {
    setExpandedId(user.id);
    setDraftRoles(user.roles);
    setError(null);
  };

  const toggleDraftRole = (role: string) => {
    setDraftRoles((prev) => (prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]));
  };

  const patchUser = async (
    userId: string,
    payload: { status?: UserStatus; setRoles?: string[] },
  ) => {
    setSavingId(userId);
    setError(null);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ userId, ...payload }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "ব্যবহারকারীর তথ্য আপডেট করা যায়নি");
        return false;
      }
      if (data.user) {
        setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...data.user } : u)));
      }
      return true;
    } catch {
      setError("নেটওয়ার্ক সমস্যা — আবার চেষ্টা করুন");
      return false;
    } finally {
      setSavingId(null);
    }
  };

  const updateStatus = (userId: string, status: UserStatus) => {
    void patchUser(userId, { status });
  };

  const saveRoles = async (userId: string) => {
    const ok = await patchUser(userId, { setRoles: draftRoles });
    if (ok) setExpandedId(null);
  };

  return (
    <div className="mt-8 space-y-5">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
          className="w-full max-w-xs rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <p className="shrink-0 font-mono text-xs text-muted-foreground">
          মোট {users.length} জন · দেখানো হচ্ছে {filtered.length} জন
        </p>
      </div>

      <div className="space-y-3">
        {filtered.map((user) => {
          const isExpanded = expandedId === user.id;
          const isSelf = user.id === currentUserId;
          const isSuperadminBeingEditedBySelf = isSelf && user.roles.includes("SUPERADMIN");

          return (
            <div key={user.id} className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{user.name || "নাম নেই"}</p>
                    {isSelf && (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted-foreground">
                        আপনি
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {user.roles.length === 0 && (
                      <span className="rounded-full bg-foreground/5 px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-muted-foreground">
                        কোনো রোল নেই
                      </span>
                    )}
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-[var(--brand-muted)] px-2 py-0.5 font-mono text-[0.58rem] uppercase tracking-[0.08em] text-[var(--brand)]"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <select
                    value={user.status}
                    disabled={savingId === user.id}
                    onChange={(e) => updateStatus(user.id, e.target.value as UserStatus)}
                    className={`rounded-md border border-border/70 px-2 py-1 text-xs ${STATUS_STYLE[user.status]}`}
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="SUSPENDED">SUSPENDED</option>
                    <option value="DELETED">DELETED</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => (isExpanded ? setExpandedId(null) : startEditing(user))}
                    className="text-xs text-[var(--brand)] hover:underline"
                  >
                    {isExpanded ? "Close" : "Edit roles"}
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 border-t border-border/40 pt-4">
                  <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
                    রোল নির্ধারণ করুন
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {allRoles.map((role) => {
                      const checked = draftRoles.includes(role);
                      const lockedSuperadmin =
                        role === "SUPERADMIN" && isSuperadminBeingEditedBySelf && checked;
                      return (
                        <label
                          key={role}
                          className={`flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-1.5 text-xs transition-colors ${
                            checked
                              ? "border-[var(--brand)]/40 bg-[var(--brand-muted)] text-[var(--brand)]"
                              : "border-border/70 bg-[var(--surface-2)] text-muted-foreground"
                          } ${lockedSuperadmin ? "opacity-60" : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            disabled={lockedSuperadmin}
                            onChange={() => toggleDraftRole(role)}
                            className="size-3.5 accent-[var(--brand)]"
                          />
                          {role}
                        </label>
                      );
                    })}
                  </div>
                  {isSuperadminBeingEditedBySelf && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      নিরাপত্তার জন্য নিজের SUPERADMIN রোল নিজে থেকে সরানো যাবে না।
                    </p>
                  )}
                  <button
                    type="button"
                    onClick={() => saveRoles(user.id)}
                    disabled={savingId === user.id}
                    className="mt-4 rounded-lg bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                  >
                    {savingId === user.id ? "সংরক্ষণ হচ্ছে..." : "রোল সংরক্ষণ করুন"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
        )}
      </div>
    </div>
  );
}
