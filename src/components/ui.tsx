import { cva, type VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center rounded-[15px] border px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]",
  {
    variants: {
      variant: {
        primary:
          "border-[var(--castrol-green-dark)] bg-[linear-gradient(180deg,var(--castrol-green),var(--castrol-green-dark))] !text-white visited:!text-white hover:!text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(12,107,52,0.28)] hover:-translate-y-0.5 hover:border-[var(--castrol-green-deep)] hover:bg-[linear-gradient(180deg,#008e3e,#0a5e2f)] hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_14px_28px_rgba(10,79,43,0.3)]",
        secondary:
          "border-[rgba(79,91,83,0.36)] bg-[rgba(247,248,245,0.96)] text-[var(--text-dark)] shadow-[0_4px_12px_rgba(30,42,35,0.08)] hover:border-[rgba(79,91,83,0.52)] hover:bg-white",
        tertiary:
          "min-h-0 rounded-md border-transparent bg-transparent px-1.5 py-1 text-[var(--castrol-green-deep)] normal-case font-medium tracking-[0.03em] shadow-none hover:underline hover:underline-offset-4",
        ghost:
          "border-transparent bg-transparent text-[var(--foreground)] hover:border-[rgba(30,42,35,0.16)] hover:bg-white",
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
  tone,
  children,
}: {
  className?: string;
  tone?: VariantProps<typeof cardVariants>["tone"];
  children: React.ReactNode;
}) {
  return <div className={cn(cardVariants({ tone }), className)}>{children}</div>;
}

const cardVariants = cva(
  "relative overflow-hidden rounded-2xl border p-6 transition",
  {
    variants: {
      tone: {
        brand:
          "border-[rgba(12,107,52,0.38)] bg-[linear-gradient(180deg,rgba(16,95,49,0.95),rgba(10,79,43,0.98))] shadow-[0_22px_48px_rgba(11,50,29,0.16)] [--muted-foreground:rgba(231,242,234,0.78)] before:absolute before:inset-x-8 before:top-0 before:h-px before:bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.75),rgba(214,31,38,0.6),transparent)] before:content-['']",
        surface:
          "border-[rgba(30,42,35,0.12)] bg-white shadow-[0_10px_26px_rgba(30,42,35,0.08)] hover:shadow-[0_16px_34px_rgba(30,42,35,0.12)]",
        panel:
          "border-[rgba(30,42,35,0.14)] bg-[var(--off-white)] shadow-[0_8px_20px_rgba(30,42,35,0.06)]",
      },
    },
    defaultVariants: { tone: "brand" },
  },
);

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
        "inline-flex items-center rounded-full border border-[rgba(30,42,35,0.16)] bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--castrol-green-deep)] shadow-[0_6px_14px_rgba(30,42,35,0.05)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

const fieldBase =
  "w-full rounded-xl border border-[rgba(30,42,35,0.16)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition placeholder:text-[rgba(79,91,83,0.74)] focus:border-[var(--brand)] focus:shadow-[0_0_0_3px_rgba(0,154,68,0.14)] disabled:cursor-not-allowed disabled:opacity-45";

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
  titleClassName,
}: {
  eyebrow: string;
  title: string;
  description: string;
  titleClassName?: string;
}) {
  return (
    <div className="max-w-3xl space-y-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--castrol-red)]">{eyebrow}</p>
      <div className="space-y-2">
        <h2 className={cn("font-display text-3xl uppercase leading-[0.98] tracking-[0.06em] text-[var(--foreground)] sm:text-4xl", titleClassName)}>
          {title}
        </h2>
        <p className="max-w-2xl text-sm leading-7 text-[var(--muted-foreground)] sm:text-base">{description}</p>
      </div>
    </div>
  );
}
