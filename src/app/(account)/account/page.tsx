import { Button, Card, Input, LinkButton } from "@/components/ui";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "Account",
  path: "/account",
});

export default function AccountPage() {
  return (
    <div className="page-shell pt-4 sm:pt-5">
      <Card
        tone="surface"
        className="overflow-hidden rounded-[2rem] border-[rgba(30,42,35,0.12)] p-0 shadow-[0_28px_70px_rgba(30,42,35,0.12)]"
      >
        <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))] p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url('/account_login_car.webp')" }}
            />
            <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_34%,rgba(0,154,68,0.08)_76%,rgba(0,154,68,0.16)),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
            <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[rgba(214,31,38,0.08)] blur-3xl" />
            <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(0,154,68,0.16)] blur-3xl" />
            <div className="relative h-full" />
          </div>

          <div className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
            <div className="mx-auto w-full max-w-md space-y-6">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Account login</p>
                <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                  Sign in
                </h3>
                <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                  Enter your email and password to continue to your account dashboard.
                </p>
              </div>

              <form className="space-y-4">
                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Email</span>
                  <Input type="email" name="email" autoComplete="email" placeholder="Enter your email" />
                </label>

                <label className="block space-y-2">
                  <span className="text-sm font-semibold text-[var(--foreground)]">Password</span>
                  <Input type="password" name="password" autoComplete="current-password" placeholder="Enter your password" />
                </label>

                <div className="space-y-3 pt-2">
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                  <LinkButton href="/account/register" variant="tertiary" className="w-full justify-center text-base font-semibold normal-case">
                    Register
                  </LinkButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
