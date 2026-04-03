import { Suspense } from "react";

import { ProductAdminForm } from "@/features/product-admin-form";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Add Product",
  path: "/adding_product",
});

export default function AddingProductPage() {
  return (
    <div className="page-shell pt-4 sm:pt-5">
      <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Loading product editor...</div>}>
        <ProductAdminForm />
      </Suspense>
    </div>
  );
}
