import { AdminRegistrationForm } from "@/features/admin-registration-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Admin Register",
  path: "/adminregister",
});

export default function AdminRegisterPage() {
  return (
    <div className="page-shell pt-4 sm:pt-5">
      <AdminRegistrationForm />
    </div>
  );
}
