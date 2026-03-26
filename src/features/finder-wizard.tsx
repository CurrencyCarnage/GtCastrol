"use client";

import { Check, ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { Button, Card, LinkButton } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { products, vehicleMakes, vehicleModels, vehicleNeeds } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface FinderOption {
  value: string;
  label: string;
  description?: string;
}

export function FinderWizard() {
  const [makeSlug, setMakeSlug] = useState("");
  const [modelSlug, setModelSlug] = useState("");
  const [needSlug, setNeedSlug] = useState("");
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);

  const filteredModels = vehicleModels.filter((model) => model.makeSlug === makeSlug);

  const { data: recommendations } = useQuery({
    queryKey: ["finder", makeSlug, modelSlug, needSlug],
    enabled: Boolean(makeSlug && modelSlug && needSlug),
    queryFn: async () => {
      trackEvent({ name: "finder_started", payload: { makeSlug, modelSlug, needSlug } });

      const map: Record<string, string[]> = {
        "engine-oil-change": ["edge-5w-30-ll", "magnatec-5w-30-dx", "gtx-5w-40-a3-b4"],
        "transmission-service": [
          "transmax-atf-dexron-vi-mercon-lv-multivehicle",
          "castrol-on-ev-transmission-fluid-d2",
        ],
        "hybrid-maintenance": ["magnatec-hybrid-0w-20", "castrol-on-ev-transmission-fluid-d2"],
        "fleet-heavy-duty": ["vecton-10w-40-e4-e7", "crb-cng-15w-40-la"],
      };

      const matched = products.filter((product) => map[needSlug]?.includes(product.slug));

      trackEvent({
        name: "recommendation_viewed",
        payload: { makeSlug, modelSlug, needSlug, count: matched.length },
      });

      return matched;
    },
  });

  const selectedRecommendation =
    recommendations?.find((product) => product.id === selectedProductId) ?? recommendations?.[0] ?? null;

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="z-10 space-y-5 overflow-visible">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/82">Decision engine</p>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">
              Vehicle-led recommendation flow
            </h3>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FinderSelect
              label="Vehicle make"
              placeholder="Choose make"
              value={makeSlug}
              onChange={(nextValue) => {
                setMakeSlug(nextValue);
                setModelSlug("");
                setSelectedProductId(null);
              }}
              options={vehicleMakes.map((make) => ({ value: make.slug, label: make.name }))}
            />
            <FinderSelect
              label="Vehicle model"
              placeholder="Choose model"
              value={modelSlug}
              onChange={(nextValue) => {
                setModelSlug(nextValue);
                setSelectedProductId(null);
              }}
              disabled={!makeSlug}
              options={filteredModels.map((model) => ({
                value: model.slug,
                label: model.name,
                description: model.yearRange,
              }))}
              emptyLabel="Choose a make first"
            />
            <FinderSelect
              label="Service intent"
              placeholder="Choose need"
              value={needSlug}
              onChange={(nextValue) => {
                setNeedSlug(nextValue);
                setSelectedProductId(null);
              }}
              options={vehicleNeeds.map((need) => ({
                value: need.slug,
                label: need.name,
                description: need.description,
              }))}
            />
          </div>
          <p className="text-sm leading-7 text-[var(--muted-foreground)]">
            The first pass is powered by typed seed data. The UI is intentionally decoupled from the recommendation source so Excel, ERP, or CMS imports can replace it later.
          </p>
        </Card>
        <Card className="space-y-4">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.18em] text-white/82">Recommendation output</p>
            <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-[var(--accent)]">
              Recommended next step
            </h3>
          </div>
          {recommendations?.length ? (
            <>
              <div className="space-y-4">
                <p className="text-xs uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
                  Select one of the suggested products to continue.
                </p>
                {recommendations.map((product) => {
                  const isSelected = selectedRecommendation?.id === product.id;

                  return (
                    <button
                      key={product.slug}
                      type="button"
                      onClick={() => setSelectedProductId(product.id)}
                      className={cn(
                        "w-full rounded-2xl border bg-white/8 p-4 text-left transition",
                        isSelected
                          ? "border-white/28 bg-white/12 shadow-[0_14px_32px_rgba(255,255,255,0.08)]"
                          : "border-white/12 hover:border-white/22 hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-white/82">{product.segment}</p>
                          <h4 className="mt-2 text-lg font-semibold text-[var(--accent)]">{product.name}</h4>
                          <p className="mt-2 text-sm leading-6 text-[var(--muted-foreground)]">
                            {product.headline}
                          </p>
                        </div>
                        {isSelected ? (
                          <span className="rounded-full border border-white/18 bg-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white">
                            Selected
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={() => {
                    trackEvent({
                      name: "campaign_cta_clicked",
                      payload: { surface: "finder-buy-online", productSlug: selectedRecommendation?.slug },
                    });
                    setIsComingSoonOpen(true);
                  }}
                >
                  Buy online
                </Button>
                <LinkButton
                  href={selectedRecommendation ? `/booking?product=${selectedRecommendation.slug}` : "/booking"}
                  variant="secondary"
                >
                  Book service
                </LinkButton>
                <LinkButton href="/service-centers" variant="ghost">
                  Find nearby center
                </LinkButton>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/14 bg-white/8 p-6 text-sm leading-7 text-[var(--muted-foreground)]">
              Choose a vehicle and service intent to reveal product recommendations and conversion paths.
            </div>
          )}
        </Card>
      </div>
      <ComingSoonDialog
        open={isComingSoonOpen}
        close={() => setIsComingSoonOpen(false)}
        title="Online checkout"
        description={
          selectedRecommendation
            ? `${selectedRecommendation.name} is mapped and ready for commerce wiring, but checkout is not live yet. This action will become available in a later release.`
            : "Online checkout is not live yet. This action will become available in a later release."
        }
      />
    </>
  );
}

function FinderSelect({
  label,
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  emptyLabel = "No options available",
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (nextValue: string) => void;
  options: FinderOption[];
  disabled?: boolean;
  emptyLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const selectedOption = options.find((option) => option.value === value);

  const handleOutsideClick = useEffectEvent((event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setOpen(false);
    }
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [open]);

  return (
    <div ref={containerRef} className={cn("relative", open && "z-20")}>
      <p className="mb-2 text-[11px] uppercase tracking-[0.18em] text-[var(--muted-foreground)]">{label}</p>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between rounded-[1.5rem] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,235,0.96))] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition",
          disabled
            ? "cursor-not-allowed opacity-45"
            : "hover:border-white/40 hover:bg-white",
          open && "border-white/60 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]",
        )}
      >
        <span className={cn("truncate text-sm", selectedOption ? "text-[var(--foreground)]" : "text-[rgba(47,79,58,0.55)]")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 text-[var(--muted-foreground)] transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div className="absolute left-0 top-full z-20 mt-2 w-full overflow-hidden rounded-[1.5rem] border border-white/30 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(242,247,238,0.98))] shadow-[0_24px_60px_rgba(8,44,24,0.16)] backdrop-blur-xl">
          {options.length ? (
            <ul role="listbox" className="max-h-72 overflow-y-auto p-2">
              {options.map((option) => {
                const isSelected = option.value === value;

                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-start justify-between rounded-[1rem] px-3 py-3 text-left transition",
                        isSelected ? "bg-[rgba(220,235,216,0.95)] text-[var(--foreground)]" : "text-[var(--foreground)] hover:bg-[rgba(220,235,216,0.72)]",
                      )}
                    >
                      <span className="space-y-1">
                        <span className="block text-sm font-medium">{option.label}</span>
                        {option.description ? (
                          <span className="block text-xs uppercase tracking-[0.14em] text-[rgba(47,79,58,0.6)]">{option.description}</span>
                        ) : null}
                      </span>
                      {isSelected ? <Check className="mt-0.5 h-4 w-4 text-[var(--brand)]" /> : null}
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-4 text-sm text-[var(--muted-foreground)]">{emptyLabel}</div>
          )}
        </div>
      ) : null}
    </div>
  );
}
