"use client";

import * as React from "react";

type SiteSetting = {
  key: string;
  value: unknown;
  description: string | null;
  updatedAt: string;
};

function formatValue(value: unknown): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

export function SettingsManager({ initialSettings }: { initialSettings: SiteSetting[] }) {
  const [settings, setSettings] = React.useState(initialSettings);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedKey, setExpandedKey] = React.useState<string | null>(null);
  const [savingKey, setSavingKey] = React.useState<string | null>(null);

  const [newKey, setNewKey] = React.useState("");
  const [newValue, setNewValue] = React.useState('""');
  const [newDescription, setNewDescription] = React.useState("");

  const createSetting = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    let parsedValue: unknown;
    try {
      parsedValue = JSON.parse(newValue);
    } catch {
      setError("Value অবশ্যই বৈধ JSON হতে হবে — যেমন: \"হ্যালো\", 42, true, অথবা {\"key\": \"value\"}");
      return;
    }

    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: newKey.trim(), value: parsedValue, description: newDescription.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Setting তৈরি করা যায়নি");
      return;
    }
    setSettings((prev) => [...prev, data.setting].sort((a, b) => a.key.localeCompare(b.key)));
    setNewKey("");
    setNewValue('""');
    setNewDescription("");
  };

  const deleteSetting = async (key: string) => {
    if (!confirm(`"${key}" সেটিংটি মুছে ফেলতে চান?`)) return;
    const res = await fetch(`/api/admin/settings/${encodeURIComponent(key)}`, { method: "DELETE" });
    if (res.ok) setSettings((prev) => prev.filter((s) => s.key !== key));
  };

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={createSetting}
        className="space-y-3 rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5"
      >
        <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
          নতুন Setting যোগ করুন
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <input
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            placeholder="key (যেমন: site.maintenanceMode)"
            className="rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
            required
          />
          <input
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="বর্ণনা (ঐচ্ছিক)"
            className="rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
          />
        </div>
        <textarea
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          rows={3}
          placeholder='value (বৈধ JSON, যেমন: true, "টেক্সট", অথবা {"a":1})'
          className="w-full resize-none rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--brand)]/50"
          required
        />
        <button
          type="submit"
          className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
        >
          Setting যোগ করুন
        </button>
      </form>

      <div className="space-y-3">
        {settings.map((setting) => (
          <SettingRow
            key={setting.key}
            setting={setting}
            isExpanded={expandedKey === setting.key}
            isSaving={savingKey === setting.key}
            onToggle={() => setExpandedKey(expandedKey === setting.key ? null : setting.key)}
            onDelete={() => deleteSetting(setting.key)}
            onSave={async (value, description) => {
              setSavingKey(setting.key);
              setError(null);
              try {
                const res = await fetch(`/api/admin/settings/${encodeURIComponent(setting.key)}`, {
                  method: "PATCH",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({ value, description }),
                });
                const data = await res.json();
                if (!res.ok) {
                  setError(data.error ?? "Setting আপডেট করা যায়নি");
                  return;
                }
                setSettings((prev) => prev.map((s) => (s.key === setting.key ? data.setting : s)));
                setExpandedKey(null);
              } finally {
                setSavingKey(null);
              }
            }}
          />
        ))}

        {settings.length === 0 && (
          <p className="text-sm text-muted-foreground">এখনো কোনো Site Setting তৈরি হয়নি।</p>
        )}
      </div>
    </div>
  );
}

function SettingRow({
  setting,
  isExpanded,
  isSaving,
  onToggle,
  onDelete,
  onSave,
}: {
  setting: SiteSetting;
  isExpanded: boolean;
  isSaving: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onSave: (value: unknown, description: string) => void;
}) {
  const [draftValue, setDraftValue] = React.useState(formatValue(setting.value));
  const [draftDescription, setDraftDescription] = React.useState(setting.description ?? "");
  const [parseError, setParseError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setDraftValue(formatValue(setting.value));
    setDraftDescription(setting.description ?? "");
  }, [setting.value, setting.description]);

  const handleSave = () => {
    try {
      const parsed = JSON.parse(draftValue);
      setParseError(null);
      onSave(parsed, draftDescription);
    } catch {
      setParseError("Value অবশ্যই বৈধ JSON হতে হবে");
    }
  };

  return (
    <div className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate font-mono text-sm font-medium">{setting.key}</p>
          {setting.description && (
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{setting.description}</p>
          )}
          <p className="mt-1 font-mono text-[0.6rem] text-muted-foreground/70">
            শেষ আপডেট: {new Date(setting.updatedAt).toLocaleString("bn-BD")}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          <button type="button" onClick={onToggle} className="text-xs text-[var(--brand)] hover:underline">
            {isExpanded ? "Close" : "Edit"}
          </button>
          <button type="button" onClick={onDelete} className="text-xs text-destructive hover:underline">
            Delete
          </button>
        </div>
      </div>

      {!isExpanded && (
        <pre className="mt-3 max-h-20 overflow-hidden rounded-lg bg-[var(--surface-2)] px-3 py-2 font-mono text-xs text-muted-foreground">
          {formatValue(setting.value)}
        </pre>
      )}

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-border/40 pt-4">
          {parseError && <p className="text-xs text-destructive">{parseError}</p>}
          <input
            value={draftDescription}
            onChange={(e) => setDraftDescription(e.target.value)}
            placeholder="বর্ণনা"
            className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
          />
          <textarea
            value={draftValue}
            onChange={(e) => setDraftValue(e.target.value)}
            rows={5}
            className="w-full resize-none rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 font-mono text-xs outline-none focus:border-[var(--brand)]/50"
          />
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="rounded-lg bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white disabled:opacity-60"
          >
            {isSaving ? "সংরক্ষণ হচ্ছে..." : "সংরক্ষণ করুন"}
          </button>
        </div>
      )}
    </div>
  );
}
