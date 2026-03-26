"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { Input } from "@/components/ui";
import { filterFinderSearchOptions, getFinderSearchOptions } from "@/lib/finder-search";
import { cn } from "@/lib/utils";

const optionKindLabel = {
  make: "Make",
  model: "Model",
  service: "Service",
  product: "Product",
  center: "Center",
} as const;

export function HomeFinderSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const allOptions = useMemo(() => getFinderSearchOptions(), []);
  const options = useMemo(() => filterFinderSearchOptions(allOptions, query, 9), [allOptions, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToQuery = () => {
    const normalized = query.trim();
    if (!normalized) {
      router.push("/finder");
      return;
    }

    router.push(`/finder?query=${encodeURIComponent(normalized)}`);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-white/84">Type to search</p>
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
        <Input
          value={query}
          onFocus={() => setOpen(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              navigateToQuery();
              setOpen(false);
            }
          }}
          placeholder="Search by brand, model, service, or product"
          className="border-white/30 bg-white/96 pl-10 text-[var(--foreground)] placeholder:text-[rgba(79,91,83,0.78)]"
        />
      </div>

      {open ? (
        <div className="absolute left-0 right-0 z-20 mt-2 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.3)] bg-white shadow-[0_24px_50px_rgba(10,22,15,0.2)]">
          {options.length ? (
            <ul className="max-h-72 overflow-y-auto p-1.5">
              {options.map((option) => (
                <li key={option.id}>
                  <button
                    type="button"
                    onMouseDown={(event) => {
                      event.preventDefault();
                      router.push(option.href);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-[var(--off-white)]"
                  >
                    <span className="text-sm font-medium text-[var(--foreground)]">{option.label}</span>
                    <span
                      className={cn(
                        "rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]",
                        option.kind === "product" && "border-[rgba(214,31,38,0.24)] text-[var(--castrol-red)]",
                      )}
                    >
                      {optionKindLabel[option.kind]}
                    </span>
                  </button>
                </li>
              ))}
              <li>
                <button
                  type="button"
                  onMouseDown={(event) => {
                    event.preventDefault();
                    navigateToQuery();
                    setOpen(false);
                  }}
                  className="mt-1 w-full rounded-lg border border-[rgba(30,42,35,0.14)] px-3 py-2 text-left text-sm font-semibold text-[var(--castrol-green-deep)] hover:bg-[var(--off-white)]"
                >
                  Open finder with this query
                </button>
              </li>
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-[var(--muted-foreground)]">No matching results yet.</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
