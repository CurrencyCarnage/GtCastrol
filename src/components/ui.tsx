import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] backdrop-blur-xl transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface)]",
  {
    variants: {
      variant: {
        primary:
          "border-[rgba(122,149,0,0.92)] bg-[linear-gradient(180deg,#bdd629,#94b300)] text-[#0a1004] [text-shadow:0_0_0.8px_rgba(7,16,8,0.9),0_1px_0_rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_24px_rgba(0,0,0,0.18)] hover:border-[var(--brand-deep)] hover:brightness-101",
        secondary:
          "border-white/14 bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] text-white hover:border-[rgba(215,25,32,0.38)] hover:bg-white/10",
        ghost:
          "border-white/10 bg-[rgba(5,10,16,0.35)] text-[var(--muted-foreground)] hover:border-white/18 hover:text-white",
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
        "relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(18,29,42,0.86),rgba(7,13,20,0.96))] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.32)] backdrop-blur-xl before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(215,25,32,0.78),transparent)] before:content-['']",
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
        "inline-flex items-center rounded-full border border-white/12 bg-[rgba(11,18,28,0.78)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const fieldBase =
  "w-full rounded-[1.35rem] border border-white/12 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.025))] px-4 py-3 text-sm text-white outline-none shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] transition placeholder:text-white/35 focus:border-[var(--brand)] focus:shadow-[0_0_0_1px_rgba(210,255,25,0.24),0_0_28px_rgba(210,255,25,0.12)] disabled:cursor-not-allowed disabled:opacity-45";

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
        <h2 className="font-display text-3xl uppercase tracking-[0.08em] text-white sm:text-4xl">
          {title}
        </h2>
        <p className="text-base leading-7 text-[var(--muted-foreground)]">{description}</p>
      </div>
    </div>
  );
}
