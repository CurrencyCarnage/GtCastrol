"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Card } from "@/components/ui";
import type { AffiliateRegistrationRecord } from "@/lib/affiliate-store";
import type { ManagedProduct } from "@/lib/catalog-store";

export function AdminProfile({
  initialProducts,
  initialAffiliates,
}: {
  initialProducts: ManagedProduct[];
  initialAffiliates: AffiliateRegistrationRecord[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [affiliates, setAffiliates] = useState(initialAffiliates);

  async function toggleHidden(slug: string, hidden: boolean) {
    const response = await fetch(`/api/admin-products/${slug}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden }),
    });
    const result = (await response.json()) as { product: ManagedProduct };
    setProducts((current) => current.map((product) => (product.slug === slug ? result.product : product)));
    router.refresh();
  }

  async function deleteProduct(slug: string) {
    const shouldDelete = window.confirm("Would you like to delete this product?");
    if (!shouldDelete) {
      return;
    }

    await fetch(`/api/admin-products/${slug}`, { method: "DELETE" });
    setProducts((current) => current.filter((product) => product.slug !== slug));
    router.refresh();
  }

  async function approveAffiliate(id: string) {
    const response = await fetch(`/api/admin-affiliates/${id}/approve`, { method: "POST" });
    const result = (await response.json()) as { affiliate: AffiliateRegistrationRecord };
    setAffiliates((current) => current.map((item) => (item.id === id ? result.affiliate : item)));
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Admin profile</p>
          <h1 className="mt-2 font-sans text-4xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
            Catalogue management
          </h1>
        </div>
        <Button onClick={() => router.push("/adding_product")}>Add Product +</Button>
      </div>

      <section className="space-y-4">
        <h2 className="font-sans text-2xl font-extrabold uppercase tracking-[0.02em] text-[var(--foreground)]">Products</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <div key={product.slug} className="group relative">
              <Card tone="surface" className="h-full space-y-4 border-[rgba(30,42,35,0.12)] bg-white text-[var(--foreground)]">
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-green-deep)]">
                    {product.hidden ? "Hidden" : product.segment}
                  </p>
                  <h3 className="font-sans text-2xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
                    {product.name}
                  </h3>
                  <p className="text-sm leading-7 text-[var(--muted-foreground)]">{product.description}</p>
                  <p className="text-sm font-semibold text-[var(--foreground)]">{product.packSizes[0]?.priceLabel}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[rgba(30,42,35,0.14)] px-3 py-1 text-xs text-[var(--muted-foreground)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </Card>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-2xl bg-[rgba(10,26,18,0.72)] opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100">
                <div className="flex gap-3">
                  <Button type="button" variant="secondary" onClick={() => toggleHidden(product.slug, !product.hidden)}>
                    {product.hidden ? "Hidden" : "Hide"}
                  </Button>
                  <Button type="button" variant="secondary" onClick={() => router.push(`/adding_product?slug=${product.slug}`)}>
                    Edit
                  </Button>
                  <Button type="button" onClick={() => deleteProduct(product.slug)}>
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-sans text-2xl font-extrabold uppercase tracking-[0.02em] text-[var(--foreground)]">Affiliate approvals</h2>
        <div className="grid gap-4 lg:grid-cols-2">
          {affiliates.map((affiliate) => (
            <Card key={affiliate.id} tone="surface" className="space-y-3 border-[rgba(30,42,35,0.12)] bg-white text-[var(--foreground)]">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--castrol-green-deep)]">{affiliate.status}</p>
                  <h3 className="mt-2 font-sans text-2xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)]">
                    {affiliate.serviceName}
                  </h3>
                </div>
                {affiliate.status === "pending" ? (
                  <Button type="button" onClick={() => approveAffiliate(affiliate.id)}>
                    Approve
                  </Button>
                ) : null}
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">Username: {affiliate.username}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Email: {affiliate.email}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Address: {affiliate.address}</p>
              <p className="text-sm text-[var(--muted-foreground)]">Phone: {affiliate.phone}</p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Coordinates: {affiliate.latitude}, {affiliate.longitude}
              </p>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${affiliate.latitude},${affiliate.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex text-sm font-semibold text-[var(--castrol-green-deep)] underline underline-offset-4"
              >
                Open pinned location
              </a>
            </Card>
          ))}
          {!affiliates.length ? <p className="text-sm text-[var(--muted-foreground)]">No affiliate requests yet.</p> : null}
        </div>
      </section>
    </div>
  );
}
