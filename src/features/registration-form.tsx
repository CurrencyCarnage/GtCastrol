"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button, Card, Input, LinkButton, Select } from "@/components/ui";
import { type RegistrationFormValues, registrationSubmissionSchema } from "@/lib/registration";

type SubmissionState =
  | { status: "idle"; message: string }
  | { status: "success" | "error"; message: string };

export function RegistrationForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
    resetField,
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSubmissionSchema),
    defaultValues: {
      role: "client",
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      serviceName: "",
      address: "",
      phone: "",
    },
  });

  const role = useWatch({ control, name: "role", defaultValue: "client" });
  const imagePath = role === "affiliate" ? "/Castrol_Service.png" : "/Client_Picture.jpg";
  const [submissionState, setSubmissionState] = useState<SubmissionState>({
    status: "idle",
    message: "",
  });

  async function onSubmit(values: RegistrationFormValues) {
    setSubmissionState({ status: "idle", message: "" });

    const response = await fetch("/api/account-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const result = (await response.json().catch(() => null)) as { message?: string } | null;

    if (!response.ok) {
      setSubmissionState({
        status: "error",
        message: result?.message || "Unable to submit the registration right now.",
      });
      return;
    }

    setSubmissionState({
      status: "success",
      message:
        result?.message ||
        (values.role === "affiliate"
          ? "Registration received. Your affiliate profile is pending admin approval."
          : "Registration received successfully."),
    });
  }

  return (
    <Card
      tone="surface"
      className="overflow-hidden rounded-[2rem] border-[rgba(30,42,35,0.12)] p-0 shadow-[0_28px_70px_rgba(30,42,35,0.12)]"
    >
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[320px] overflow-hidden bg-[linear-gradient(135deg,rgba(242,248,244,0.98),rgba(215,241,224,0.82)_55%,rgba(185,226,199,0.78))] p-6 sm:p-8 lg:min-h-[640px] lg:p-10">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${imagePath}')` }} />
          <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_34%,rgba(0,154,68,0.08)_76%,rgba(0,154,68,0.16)),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />
          <div className="absolute -left-16 bottom-0 h-40 w-40 rounded-full bg-[rgba(214,31,38,0.08)] blur-3xl" />
          <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-[rgba(0,154,68,0.16)] blur-3xl" />
          <div className="relative h-full" />
        </div>

        <div className="flex items-center bg-white p-6 sm:p-8 lg:p-10">
          <div className="mx-auto w-full max-w-md space-y-6">
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--castrol-green-deep)]">
                Account registration
              </p>
              <h1 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-[var(--foreground)] sm:text-4xl">
                Register
              </h1>
              <p className="text-sm leading-7 text-[var(--muted-foreground)]">
                Create a client account or send an affiliate registration for admin approval.
              </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <FieldLabel htmlFor="role" label="Role" required />
                <Select
                  id="role"
                  {...register("role", {
                    onChange: (event) => {
                      setSubmissionState({ status: "idle", message: "" });

                      if (event.target.value !== "affiliate") {
                        resetField("serviceName", { defaultValue: "" });
                        resetField("address", { defaultValue: "" });
                        resetField("phone", { defaultValue: "" });
                      }
                    },
                  })}
                >
                  <option value="client">Client</option>
                  <option value="affiliate">Affiliate</option>
                </Select>
                <FieldError message={errors.role?.message} />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="username" label="Username" required />
                <Input
                  id="username"
                  placeholder="Enter your username"
                  {...register("username", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                <FieldError message={errors.username?.message} />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="email" label="Email address" required />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Enter your email address"
                  {...register("email", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                <FieldError message={errors.email?.message} />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="password" label="Password" required />
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Enter your password"
                  {...register("password", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                <FieldError message={errors.password?.message} />
              </div>

              <div className="space-y-2">
                <FieldLabel htmlFor="confirmPassword" label="Confirm password" required />
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Confirm your password"
                  {...register("confirmPassword", {
                    onChange: () => setSubmissionState({ status: "idle", message: "" }),
                  })}
                />
                <FieldError message={errors.confirmPassword?.message} />
              </div>

              {role === "affiliate" ? (
                <div className="space-y-4 rounded-[1.5rem] border border-[rgba(30,42,35,0.12)] bg-[var(--off-white)] p-4">
                  <div className="space-y-2">
                    <FieldLabel htmlFor="serviceName" label="Service name" required />
                    <Input
                      id="serviceName"
                      placeholder="Enter your service name"
                      {...register("serviceName", {
                        onChange: () => setSubmissionState({ status: "idle", message: "" }),
                      })}
                    />
                    <FieldError message={errors.serviceName?.message} />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="address" label="Address" required />
                    <Input
                      id="address"
                      placeholder="Enter your address"
                      {...register("address", {
                        onChange: () => setSubmissionState({ status: "idle", message: "" }),
                      })}
                    />
                    <FieldError message={errors.address?.message} />
                  </div>

                  <div className="space-y-2">
                    <FieldLabel htmlFor="phone" label="Phone number" required />
                    <Input
                      id="phone"
                      inputMode="tel"
                      autoComplete="tel"
                      placeholder="Enter your phone number"
                      {...register("phone", {
                        onChange: () => setSubmissionState({ status: "idle", message: "" }),
                      })}
                    />
                    <FieldError message={errors.phone?.message} />
                  </div>
                </div>
              ) : null}

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
                <LinkButton href="/account" variant="tertiary" className="w-full justify-center text-base font-semibold normal-case">
                  Back to login
                </LinkButton>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Card>
  );
}

function FieldLabel({
  htmlFor,
  label,
  required = false,
}: {
  htmlFor: string;
  label: string;
  required?: boolean;
}) {
  return (
    <label htmlFor={htmlFor} className="text-sm font-semibold text-[var(--foreground)]">
      {label}
      {required ? <span className="ml-1 text-[var(--castrol-red)]">*</span> : null}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-sm text-[var(--danger)]">{message}</p>;
}
