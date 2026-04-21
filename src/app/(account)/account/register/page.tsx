import { Suspense } from "react";

import { RegistrationForm } from "@/features/registration-form";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Register",
  path: "/account/register",
});

export default function RegisterPage() {
  return (
    <div className="page-shell pt-4 sm:pt-5">
      <Suspense fallback={<div className="text-sm text-[var(--muted-foreground)]">Loading registration...</div>}>
        <RegistrationForm />
      </Suspense>
    </div>
  );
}
