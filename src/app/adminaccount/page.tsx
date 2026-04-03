import { AdminLoginForm } from "@/features/admin-login-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin Account",
  path: "/adminaccount",
});

export default function AdminAccountPage() {
  return (
    <div className="page-shell pt-4 sm:pt-5">
      <AdminLoginForm />
    </div>
  );
}
