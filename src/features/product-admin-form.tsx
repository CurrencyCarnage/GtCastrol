"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Button, Card, Input } from "@/components/ui";
import type { ManagedProduct } from "@/lib/catalog-store";

export function ProductAdminForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = searchParams.get("slug");
  const isEditing = Boolean(slug);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    tags: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!slug) {
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const response = await fetch(`/api/admin-products/${slug}`);
      const result = (await response.json()) as { product?: ManagedProduct };

      if (!cancelled && result.product) {
        setForm({
          name: result.product.name,
          price: result.product.packSizes[0]?.priceLabel ?? "",
          description: result.product.description,
          tags: result.product.tags.join(", "),
        });
        setPreviewUrl(result.product.imagePath ?? null);
      }

      if (!cancelled) {
        setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setMessage("");

    const payload = new FormData();
    payload.set("name", form.name);
    payload.set("price", form.price);
    payload.set("description", form.description);
    payload.set("tags", form.tags);
    if (imageFile) {
      payload.set("image", imageFile);
    }

    const response = await fetch(isEditing ? `/api/admin-products/${slug}` : "/api/admin-products", {
      method: isEditing ? "PUT" : "POST",
      body: payload,
    });

    const result = (await response.json().catch(() => null)) as { message?: string } | { product?: ManagedProduct } | null;

    setSubmitting(false);

    if (!response.ok) {
      setMessage("Unable to save the product right now.");
      return;
    }

    setMessage(isEditing ? "Product updated successfully." : "Product added successfully.");
    router.push("/admin-profile");
    router.refresh();
  }

  return (
    <Card tone="surface" className="overflow-hidden rounded-[2rem] border-[rgba(30,42,35,0.12)] p-0 shadow-[0_28px_70px_rgba(30,42,35,0.12)]">
      <form className="grid lg:grid-cols-[1.05fr_0.95fr]" onSubmit={handleSubmit}>
        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))] p-6 sm:p-8 lg:min-h-[640px] lg:p-10">
          <div className="flex h-full flex-col justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Product image</p>
              <h1 className="mt-3 font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                Add picture
              </h1>
            </div>
            <label className="flex h-full min-h-[280px] cursor-pointer items-center justify-center rounded-[1.75rem] border border-dashed border-[rgba(30,42,35,0.22)] bg-white/70 p-4 text-center shadow-[0_16px_36px_rgba(30,42,35,0.08)]">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(event) => {
                  const nextFile = event.target.files?.[0] ?? null;
                  setImageFile(nextFile);
                  setPreviewUrl(nextFile ? URL.createObjectURL(nextFile) : previewUrl);
                }}
              />
              {previewUrl ? (
                <div className="relative h-full min-h-[260px] w-full overflow-hidden rounded-[1.25rem]">
                  <Image src={previewUrl} alt="Product preview" fill className="object-cover" unoptimized />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="font-sans text-2xl font-extrabold uppercase tracking-[0.02em] text-[var(--foreground)]">Choose product image</p>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">Click here to upload the product picture.</p>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-5">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">
                {isEditing ? "Edit product" : "Add product"}
              </p>
              <h2 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                {isEditing ? "Update product" : "New catalogue item"}
              </h2>
            </div>

            {loading ? (
              <p className="text-sm text-[var(--muted-foreground)]">Loading product details...</p>
            ) : (
              <>
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Product name</span>
                  <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} required />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Price</span>
                  <Input value={form.price} onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))} required />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Description</span>
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    required
                    className="min-h-32 w-full rounded-xl border border-[rgba(30,42,35,0.16)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(0,154,68,0.14)]"
                  />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Tags</span>
                  <Input
                    value={form.tags}
                    onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))}
                    placeholder="Use commas between keywords"
                    required
                  />
                </label>

                {message ? <p className="text-sm text-[var(--castrol-green-deep)]">{message}</p> : null}

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={() => router.push("/admin-profile")}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Saving..." : isEditing ? "Add" : "Add"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </form>
    </Card>
  );
}
