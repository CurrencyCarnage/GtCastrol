import { AdminProfile } from "@/features/admin-profile";
import { listAffiliateRegistrations } from "@/lib/affiliate-store";
import { getManagedProducts } from "@/lib/catalog-store";
import { buildMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Admin Profile",
  path: "/admin-profile",
});

export default async function AdminProfilePage() {
  const [products, affiliates] = await Promise.all([
    getManagedProducts({ includeHidden: true }),
    listAffiliateRegistrations(),
  ]);

  return (
    <div className="page-shell space-y-8">
      <AdminProfile initialProducts={products} initialAffiliates={affiliates} />
    </div>
  );
}
