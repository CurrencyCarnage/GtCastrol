"use client";

import { X } from "lucide-react";
import { useEffect, useEffectEvent } from "react";

import { Button } from "@/components/ui";

export function ComingSoonDialog({
  open,
  title,
  description,
  close,
}: {
  open: boolean;
  title: string;
  description: string;
  close: () => void;
}) {
  const handleEscape = useEffectEvent((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      close();
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[rgba(9,34,19,0.18)] px-4 backdrop-blur-sm" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="coming-soon-title"
        className="w-full max-w-md rounded-[1.8rem] border border-[rgba(0,91,42,0.14)] bg-[linear-gradient(180deg,rgba(250,252,247,0.99),rgba(240,247,235,0.99))] p-6 shadow-[0_24px_80px_rgba(12,52,30,0.14)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.18em] text-[var(--accent)]">Coming soon</p>
            <h2 id="coming-soon-title" className="font-display text-3xl uppercase tracking-[0.1em] text-[var(--foreground)]">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={close}
            className="rounded-full border border-[rgba(0,91,42,0.14)] p-2 text-[var(--muted-foreground)] transition hover:border-[rgba(0,133,63,0.3)] hover:text-[var(--foreground)]"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">{description}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button type="button" onClick={close}>
            Understood
          </Button>
        </div>
      </div>
    </div>
  );
}
