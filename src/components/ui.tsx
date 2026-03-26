import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  {
    variants: {
      variant: {
        primary:
          "border-[rgba(0,91,42,0.9)] bg-[linear-gradient(180deg,#0aa24b,#007a37)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_12px_28px_rgba(0,122,55,0.22)] hover:border-[var(--brand-deep)] hover:brightness-[1.02]",
        secondary:
          "border-[rgba(0,91,42,0.18)] bg-[rgba(255,255,255,0.9)] text-[var(--foreground)] shadow-[0_10px_24px_rgba(15,52,33,0.06)] hover:border-[rgba(0,133,63,0.34)] hover:bg-white",
        ghost:
          "border-[rgba(0,91,42,0.14)] bg-[rgba(255,255,255,0.5)] text-[var(--foreground)] hover:border-[rgba(0,133,63,0.28)] hover:bg-white",
      },
    },
    defaultVariants: { variant: "primary" },
  },
);

export function Button({
  className,
  variant,
  ...props
}: ComponentPropsWithoutRef<"button"> & VariantProps<typeof buttonVariants>) {
  return <button className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function LinkButton({
  className,
  variant,
  ...props
}: ComponentPropsWithoutRef<typeof Link> & VariantProps<typeof buttonVariants>) {
  return <Link className={cn(buttonVariants({ variant }), className)} {...props} />;
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.75rem] border border-[rgba(0,91,42,0.18)] bg-[linear-gradient(180deg,rgba(16,85,44,0.95),rgba(10,63,33,0.98))] p-6 shadow-[0_22px_48px_rgba(11,50,29,0.12)] backdrop-blur-xl [--muted-foreground:rgba(231,242,234,0.78)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),rgba(215,25,32,0.6),transparent)] before:content-['']",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[rgba(0,91,42,0.14)] bg-[rgba(255,255,255,0.82)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--brand-deep)] shadow-[0_8px_16px_rgba(11,50,29,0.05)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const fieldBase =
  "w-full rounded-[1.35rem] border border-[rgba(0,91,42,0.16)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(245,250,241,0.96))] px-4 py-3 text-sm text-[var(--foreground)] outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition placeholder:text-[rgba(47,79,58,0.48)] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(0,133,63,0.12)] disabled:cursor-not-allowed disabled:opacity-45";

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(fieldBase, props.className)} />;
}

export function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(fieldBase, "appearance-none pr-12", props.className)} />
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <Badge>{eyebrow}</Badge>
      <div className="space-y-3">
        <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-[var(--foreground)] sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">{description}</p>
      </div>
    </div>
  );
}
