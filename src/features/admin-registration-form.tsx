"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button, Card, Input, LinkButton } from "@/components/ui";
import { adminRegistrationSchema, type AdminRegistrationFormValues } from "@/lib/admin-auth-schema";

type SubmissionState =
  | { status: "idle"; message: string }
  | { status: "success" | "error"; message: string };

export function AdminRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminRegistrationFormValues>({
    resolver: zodResolver(adminRegistrationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  async function onSubmit(values: AdminRegistrationFormValues) {
    setSubmissionState({ status: "idle", message: "" });

    const response = await fetch("/api/admin-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json().catch(() => null)) as { message?: string } | null;

    setSubmissionState({
      status: response.ok ? "success" : "error",
      message: result?.message || "Unable to submit the admin registration right now.",
    });
  }

  return (
    <Card
      tone="surface"
      className="overflow-hidden rounded-[2rem] border-[rgba(30,42,35,0.12)] p-0 shadow-[0_28px_70px_rgba(30,42,35,0.12)]"
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))] p-6 sm:p-8 lg:min-h-[640px] lg:p-10">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/Admin_picture.jpg')" }} />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_34%,rgba(0,154,68,0.08)_76%,rgba(0,154,68,0.16)),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[rgba(214,31,38,0.08)] blur-3xl" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(0,154,68,0.16)] blur-3xl" />
          <div className="relative h-full" />
        </div>

        <div className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">Admin registration</p>
              <h1 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                Register
              </h1>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Create an admin profile and wait for email confirmation before signing in.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <FieldBlock label="Username" required error={errors.username?.message}>
                <Input
                  placeholder="Enter your username"
                  {...register("username", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
              </FieldBlock>

              <FieldBlock label="Email address" required error={errors.email?.message}>
                <Input
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
              </FieldBlock>

              <FieldBlock label="Password" required error={errors.password?.message}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("password", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
              </FieldBlock>

              <FieldBlock label="Confirm password" required error={errors.confirmPassword?.message}>
                <Input
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
              </FieldBlock>

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
                  {isSubmitting ? "Submitting..." : "Register"}
                </Button>
                <LinkButton href="/adminaccount" variant="tertiary" className="w-full justify-center text-base font-semibold normal-case">
                  Back to admin login
                </LinkButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FieldBlock({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[var(--foreground)]">
        {label}
        {required ? <span className="ml-1 text-[var(--castrol-red)]">*</span> : null}
      </label>
      {children}
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
    </div>
  );
}
