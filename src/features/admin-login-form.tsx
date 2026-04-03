"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Card, Input, LinkButton } from "@/components/ui";
import { adminLoginSchema, type AdminLoginValues } from "@/lib/admin-auth-schema";

type SubmissionState =
  | { status: "idle"; message: string }
  | { status: "success" | "error"; message: string };

export function AdminLoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminLoginValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  async function onSubmit(values: AdminLoginValues) {
    setSubmissionState({ status: "idle", message: "" });

    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json().catch(() => null)) as { message?: string } | null;

    setSubmissionState({
      status: response.ok ? "success" : "error",
      message: result?.message || "Unable to sign in right now.",
    });

    if (response.ok) {
      router.push("/admin-profile");
      router.refresh();
    }
  }

  return (
    <Card
      tone="surface"
      className="overflow-hidden rounded-[2rem] border-[rgba(30,42,35,0.12)] p-0 shadow-[0_28px_70px_rgba(30,42,35,0.12)]"
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))] p-6 sm:p-8 lg:min-h-[560px] lg:p-10">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/admin_login.jpg')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_34%,rgba(0,154,68,0.08)_76%,rgba(0,154,68,0.16)),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[rgba(214,31,38,0.08)] blur-3xl" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(0,154,68,0.16)] blur-3xl" />
          <div className="relative h-full" />
        </div>

        <div className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Admin account</p>
              <h1 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                Sign in
              </h1>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Use your admin username or email and password to access the admin account.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Username or email</label>
                <Input
                  placeholder="Enter your username or email"
                  {...register("identifier", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                {errors.identifier?.message ? <p className="text-sm text-[var(--danger)]">{errors.identifier.message}</p> : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">Password</label>
                <Input
                  type="password"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  {...register("password", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                {errors.password?.message ? <p className="text-sm text-[var(--danger)]">{errors.password.message}</p> : null}
              </div>

              {submissionState.message ? (
                <div
                  className={
                    submissionState.status === "success"
                      ? "rounded-[1.25rem] border border-[rgba(12,107,52,0.2)] bg-[rgba(0,154,68,0.08)] px-4 py-3 text-sm leading-6 text-[var(--castrol-green-deep)]"
                      : "rounded-[1.25rem] border border-[rgba(180,25,31,0.16)] bg-[rgba(180,25,31,0.06)] px-4 py-3 text-sm leading-6 text-[var(--danger)]"
                  }
                >
                  {submissionState.message}
                </div>
              ) : null}

              <div className="space-y-3 pt-2">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? "Signing in..." : "Login"}
                </Button>
                <LinkButton href="/adminregister" variant="tertiary" className="w-full justify-center text-base font-semibold normal-case">
                  Register
                </LinkButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}
