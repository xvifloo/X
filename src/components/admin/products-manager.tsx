"use client";

import * as React from "react";

type ProductTranslation = {
  id?: string;
  locale: string;
  name: string;
  tagline?: string | null;
  description?: string | null;
};
type Product = {
  id: string;
  key: string;
  status: "LIVE" | "BUILDING" | "RESEARCH" | "ARCHIVED";
  accentColor: string;
  translations: ProductTranslation[];
};

function nameFor(p: Product, locale: "en" | "bn") {
  return p.translations.find((t) => t.locale === locale)?.name ?? "";
}

export function ProductsManager({ initialProducts }: { initialProducts: Product[] }) {
  const [products, setProducts] = React.useState(initialProducts);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  const [newKey, setNewKey] = React.useState("");
  const [newName, setNewName] = React.useState("");
  const [newColor, setNewColor] = React.useState("#17b79b");

  const createProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: newKey, name: newName, accentColor: newColor }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Product তৈরি করা যায়নি");
      return;
    }
    setProducts((prev) => [...prev, data.product]);
    setNewKey("");
    setNewName("");
  };

  const updateStatus = async (id: string, status: Product["status"]) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
  };

  const saveTranslation = async (id: string, translation: ProductTranslation) => {
    const res = await fetch(`/api/admin/products/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ translation }),
    });
    const data = await res.json();
    if (res.ok) setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("এই Product টি মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    if (res.ok) setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <div className="mt-8 space-y-6">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={createProduct}
        className="grid gap-3 rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5 sm:grid-cols-[1fr_1fr_auto_auto]"
      >
        <input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="key (e.g. xviget)"
          className="rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
          required
        />
        <input
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Name (English)"
          className="rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
          required
        />
        <input
          type="color"
          value={newColor}
          onChange={(e) => setNewColor(e.target.value)}
          className="h-10 w-14 rounded-lg border border-border/70 bg-[var(--surface-2)]"
        />
        <button type="submit" className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white">
          Add product
        </button>
      </form>

      <div className="space-y-3">
        {products.map((p) => {
          const isExpanded = expandedId === p.id;
          const en = p.translations.find((t) => t.locale === "en") ?? { locale: "en", name: "" };
          const bn = p.translations.find((t) => t.locale === "bn") ?? { locale: "bn", name: "" };

          return (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span
                    className="size-3 rounded-full"
                    style={{ backgroundColor: p.accentColor }}
                    aria-hidden="true"
                  />
                  <p className="font-medium">{nameFor(p, "en") || p.key}</p>
                  <span className="font-mono text-xs text-muted-foreground">{p.key}</span>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={p.status}
                    onChange={(e) => updateStatus(p.id, e.target.value as Product["status"])}
                    className="rounded-md border border-border/70 bg-[var(--surface-2)] px-2 py-1 text-xs"
                  >
                    <option value="LIVE">LIVE</option>
                    <option value="BUILDING">BUILDING</option>
                    <option value="RESEARCH">RESEARCH</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    className="text-xs text-[var(--brand)] hover:underline"
                  >
                    {isExpanded ? "Close" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteProduct(p.id)}
                    className="text-xs text-destructive hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="mt-4 grid gap-4 border-t border-border/40 pt-4 md:grid-cols-2">
                  <ProductTranslationEditor
                    label="English"
                    translation={en}
                    onSave={(t) => saveTranslation(p.id, { ...t, locale: "en" })}
                  />
                  <ProductTranslationEditor
                    label="বাংলা"
                    translation={bn}
                    onSave={(t) => saveTranslation(p.id, { ...t, locale: "bn" })}
                  />
                </div>
              )}
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-sm text-muted-foreground">এখনো কোনো Product তৈরি হয়নি।</p>
        )}
      </div>
    </div>
  );
}

function ProductTranslationEditor({
  label,
  translation,
  onSave,
}: {
  label: string;
  translation: ProductTranslation;
  onSave: (t: ProductTranslation) => void;
}) {
  const [name, setName] = React.useState(translation.name);
  const [tagline, setTagline] = React.useState(translation.tagline ?? "");
  const [description, setDescription] = React.useState(translation.description ?? "");

  return (
    <div className="rounded-xl border border-border/60 bg-[var(--surface-2)] p-4">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 space-y-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="w-full rounded-lg border border-border/70 bg-[var(--surface-1)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Tagline"
          className="w-full rounded-lg border border-border/70 bg-[var(--surface-1)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={3}
          className="w-full resize-none rounded-lg border border-border/70 bg-[var(--surface-1)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <button
          type="button"
          onClick={() => onSave({ locale: translation.locale, name, tagline, description })}
          className="rounded-lg bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white"
        >
          Save {label}
        </button>
      </div>
    </div>
  );
}
