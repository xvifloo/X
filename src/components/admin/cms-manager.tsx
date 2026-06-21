"use client";

import * as React from "react";

type ContentType = { id: string; key: string; name: string };
type ContentTranslation = {
  id?: string;
  locale: string;
  title: string;
  description?: string | null;
  body?: string | null;
};
type ContentItem = {
  id: string;
  typeId: string;
  slug: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  type: ContentType;
  translations: ContentTranslation[];
};

function translationFor(item: ContentItem, locale: "en" | "bn"): ContentTranslation {
  return (
    item.translations.find((t) => t.locale === locale) ?? { locale, title: "", description: "", body: "" }
  );
}

export function CmsManager({
  initialTypes,
  initialItems,
}: {
  initialTypes: ContentType[];
  initialItems: ContentItem[];
}) {
  const [types, setTypes] = React.useState(initialTypes);
  const [items, setItems] = React.useState(initialItems);
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const [newTypeKey, setNewTypeKey] = React.useState("");
  const [newTypeName, setNewTypeName] = React.useState("");

  const [newItemTypeId, setNewItemTypeId] = React.useState("");
  const [newItemSlug, setNewItemSlug] = React.useState("");
  const [newItemTitle, setNewItemTitle] = React.useState("");

  const createType = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/content-types", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ key: newTypeKey, name: newTypeName }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Content Type তৈরি করা যায়নি");
      return;
    }
    setTypes((prev) => [...prev, data.type]);
    setNewTypeKey("");
    setNewTypeName("");
  };

  const createItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch("/api/admin/content-items", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ typeId: newItemTypeId, slug: newItemSlug, title: newItemTitle }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Content Item তৈরি করা যায়নি");
      return;
    }
    setItems((prev) => [data.item, ...prev]);
    setNewItemSlug("");
    setNewItemTitle("");
  };

  const updateStatus = async (id: string, status: ContentItem["status"]) => {
    const res = await fetch(`/api/admin/content-items/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
    }
  };

  const saveTranslation = async (id: string, translation: ContentTranslation) => {
    const res = await fetch(`/api/admin/content-items/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ translation }),
    });
    const data = await res.json();
    if (res.ok) {
      setItems((prev) => prev.map((it) => (it.id === id ? data.item : it)));
    }
  };

  const deleteItem = async (id: string) => {
    if (!confirm("এই কনটেন্ট আইটেমটি স্থায়ীভাবে মুছে ফেলতে চান?")) return;
    const res = await fetch(`/api/admin/content-items/${id}`, { method: "DELETE" });
    if (res.ok) {
      setItems((prev) => prev.filter((it) => it.id !== id));
    }
  };

  return (
    <div className="mt-8 space-y-8">
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2">
        <form
          onSubmit={createType}
          className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5"
        >
          <h2 className="font-heading text-sm font-semibold">নতুন Content Type</h2>
          <div className="mt-3 space-y-2">
            <input
              value={newTypeKey}
              onChange={(e) => setNewTypeKey(e.target.value)}
              placeholder="key (e.g. blog_post)"
              className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
              required
            />
            <input
              value={newTypeName}
              onChange={(e) => setNewTypeName(e.target.value)}
              placeholder="Name (e.g. Blog Post)"
              className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
            >
              তৈরি করুন
            </button>
          </div>
        </form>

        <form
          onSubmit={createItem}
          className="rounded-2xl border border-border/60 bg-[var(--surface-1)] p-5"
        >
          <h2 className="font-heading text-sm font-semibold">নতুন Content Item</h2>
          <div className="mt-3 space-y-2">
            <select
              value={newItemTypeId}
              onChange={(e) => setNewItemTypeId(e.target.value)}
              className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
              required
            >
              <option value="">Content Type বাছাই করুন</option>
              {types.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
            <input
              value={newItemSlug}
              onChange={(e) => setNewItemSlug(e.target.value)}
              placeholder="slug"
              className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
              required
            />
            <input
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              placeholder="Title (English)"
              className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
              required
            />
            <button
              type="submit"
              className="rounded-lg bg-[var(--brand)] px-4 py-2 text-sm font-medium text-white"
            >
              তৈরি করুন
            </button>
          </div>
        </form>
      </section>

      <section className="overflow-hidden rounded-2xl border border-border/60 bg-[var(--surface-1)]">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-[var(--surface-2)] text-left text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const en = translationFor(item, "en");
              const bn = translationFor(item, "bn");
              const isExpanded = expandedId === item.id;

              return (
                <React.Fragment key={item.id}>
                  <tr className="border-b border-border/40 last:border-0">
                    <td className="px-4 py-3">{en.title || "(no title)"}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.type?.name}</td>
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{item.slug}</td>
                    <td className="px-4 py-3">
                      <select
                        value={item.status}
                        onChange={(e) => updateStatus(item.id, e.target.value as ContentItem["status"])}
                        className="rounded-md border border-border/70 bg-[var(--surface-2)] px-2 py-1 text-xs"
                      >
                        <option value="DRAFT">DRAFT</option>
                        <option value="PUBLISHED">PUBLISHED</option>
                        <option value="ARCHIVED">ARCHIVED</option>
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="mr-3 text-xs text-[var(--brand)] hover:underline"
                      >
                        {isExpanded ? "Close" : "Edit"}
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteItem(item.id)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className="border-b border-border/40 bg-[var(--surface-2)]/50">
                      <td colSpan={5} className="px-4 py-4">
                        <div className="grid gap-4 md:grid-cols-2">
                          <TranslationEditor
                            label="English"
                            translation={en}
                            onSave={(t) => saveTranslation(item.id, { ...t, locale: "en" })}
                          />
                          <TranslationEditor
                            label="বাংলা"
                            translation={bn}
                            onSave={(t) => saveTranslation(item.id, { ...t, locale: "bn" })}
                          />
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  এখনো কোনো Content Item তৈরি হয়নি।
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}

function TranslationEditor({
  label,
  translation,
  onSave,
}: {
  label: string;
  translation: ContentTranslation;
  onSave: (t: ContentTranslation) => void;
}) {
  const [title, setTitle] = React.useState(translation.title);
  const [description, setDescription] = React.useState(translation.description ?? "");
  const [body, setBody] = React.useState(translation.body ?? "");

  return (
    <div className="rounded-xl border border-border/60 bg-[var(--surface-1)] p-4">
      <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-2 space-y-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          placeholder="Body"
          rows={4}
          className="w-full resize-none rounded-lg border border-border/70 bg-[var(--surface-2)] px-3 py-2 text-sm outline-none focus:border-[var(--brand)]/50"
        />
        <button
          type="button"
          onClick={() => onSave({ locale: translation.locale, title, description, body })}
          className="rounded-lg bg-[var(--brand)] px-4 py-1.5 text-xs font-medium text-white"
        >
          Save {label}
        </button>
      </div>
    </div>
  );
}
