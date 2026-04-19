"use client";

import { ArrowRight, CarFront, Droplet, IdCard, LocateFixed, Search } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { Button, Card, Input, LinkButton, Select } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { vehicleMakes, vehicleModels, vehicleNeeds } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import type { Product, ServiceCenter } from "@/types/domain";

type FinderMode = "vehicle" | "plate" | "fluid";
type FinderVehicleType = "cars-light-duty-trucks" | "commercial-fleet" | "hybrid-ev";

interface FinderResult {
  id: string;
  vehicleType: FinderVehicleType;
  makeSlug: string;
  makeName: string;
  modelSlug: string;
  modelName: string;
  yearRangeLabel: string;
  years: number[];
  needSlug: string;
  needName: string;
  centerSlug: string;
  centerName: string;
  centerCity: string;
  centerAddress: string;
  centerSource: ServiceCenter["source"];
  centerGeolocation: ServiceCenter["geolocation"];
  serviceName: string;
  productSlug: string;
  productName: string;
}

const modeOptions: Array<{ value: FinderMode; label: string; Icon: typeof CarFront }> = [
  { value: "vehicle", label: "Vehicle & Equipment", Icon: CarFront },
  { value: "plate", label: "License Plate Search", Icon: IdCard },
  { value: "fluid", label: "Fluid & Oil Search", Icon: Droplet },
];

const vehicleTypeOptions: Array<{ value: FinderVehicleType; label: string }> = [
  { value: "cars-light-duty-trucks", label: "Cars & Light Duty Trucks" },
  { value: "commercial-fleet", label: "Commercial / Fleet" },
  { value: "hybrid-ev", label: "Hybrid / EV" },
];

const modelVehicleTypeMap: Record<string, FinderVehicleType> = {
  actros: "commercial-fleet",
  bronco: "cars-light-duty-trucks",
  "rav4-hybrid": "hybrid-ev",
  "id-4": "hybrid-ev",
  "atto-3": "hybrid-ev",
};

const vehicleTypeNeedMap: Record<FinderVehicleType, string[]> = {
  "cars-light-duty-trucks": ["engine-oil-change", "transmission-service"],
  "commercial-fleet": ["fleet-heavy-duty", "transmission-service"],
  "hybrid-ev": ["hybrid-maintenance", "transmission-service"],
};

const needToServiceSlug: Record<string, string> = {
  "engine-oil-change": "oil-change",
  "transmission-service": "gearbox-service",
  "hybrid-maintenance": "hybrid-service",
  "fleet-heavy-duty": "fleet-service",
};

const needToFamilySlugs: Record<string, string[]> = {
  "engine-oil-change": ["edge", "magnatec", "gtx"],
  "transmission-service": ["transmax", "castrol-on"],
  "hybrid-maintenance": ["magnatec-hybrid", "castrol-on", "transmax"],
  "fleet-heavy-duty": ["vecton", "crb", "transmax"],
};

export function FinderWizard({
  products,
  serviceCenters,
}: {
  products: Product[];
  serviceCenters: ServiceCenter[];
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query")?.trim() ?? "";
  const [mode, setMode] = useState<FinderMode>("vehicle");
  const [vehicleType, setVehicleType] = useState<FinderVehicleType>("cars-light-duty-trucks");
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [makeSlug, setMakeSlug] = useState("");
  const [modelSlug, setModelSlug] = useState("");
  const [year, setYear] = useState("");
  const [needSlug, setNeedSlug] = useState("");
  const [isComingSoonOpen, setIsComingSoonOpen] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationMessage, setLocationMessage] = useState("Use your location to sort the best nearby service matches first.");

  const allFinderResults = useMemo(() => buildFinderResults(products, serviceCenters), [products, serviceCenters]);

  const availableMakes = useMemo(() => {
    const makeSlugs = new Set(
      vehicleModels
        .filter((model) => getModelVehicleType(model.slug) === vehicleType)
        .map((model) => model.makeSlug),
    );

    return vehicleMakes.filter((make) => makeSlugs.has(make.slug));
  }, [vehicleType]);

  const availableModels = useMemo(() => {
    return vehicleModels.filter(
      (model) =>
        getModelVehicleType(model.slug) === vehicleType &&
        (makeSlug ? model.makeSlug === makeSlug : true),
    );
  }, [vehicleType, makeSlug]);

  const availableYears = useMemo(() => {
    if (modelSlug) {
      const model = vehicleModels.find((entry) => entry.slug === modelSlug);
      return model ? parseYearRange(model.yearRange) : [];
    }

    const years = new Set<number>();

    availableModels.forEach((model) => {
      parseYearRange(model.yearRange).forEach((entry) => years.add(entry));
    });

    return Array.from(years).sort((a, b) => b - a);
  }, [modelSlug, availableModels]);

  const availableNeeds = useMemo(() => {
    const allowedNeedSlugs = new Set(vehicleTypeNeedMap[vehicleType]);
    return vehicleNeeds.filter((need) => allowedNeedSlugs.has(need.slug));
  }, [vehicleType]);

  const selectedMakeSlug = availableMakes.some((entry) => entry.slug === makeSlug) ? makeSlug : "";
  const selectedModelSlug = availableModels.some((entry) => entry.slug === modelSlug) ? modelSlug : "";
  const selectedNeedSlug = availableNeeds.some((entry) => entry.slug === needSlug) ? needSlug : "";
  const selectedYear = year && availableYears.includes(Number.parseInt(year, 10)) ? year : "";

  const filteredResults = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return allFinderResults
      .filter((result) => {
        if (result.vehicleType !== vehicleType) {
          return false;
        }

        if (selectedMakeSlug && result.makeSlug !== selectedMakeSlug) {
          return false;
        }

        if (selectedModelSlug && result.modelSlug !== selectedModelSlug) {
          return false;
        }

        if (selectedNeedSlug && result.needSlug !== selectedNeedSlug) {
          return false;
        }

        if (selectedYear) {
          const yearValue = Number.parseInt(selectedYear, 10);
          if (!Number.isFinite(yearValue) || !result.years.includes(yearValue)) {
            return false;
          }
        }

        if (!normalizedSearch) {
          return true;
        }

        const haystack = [
          result.makeName,
          result.modelName,
          result.needName,
          result.serviceName,
          result.productName,
          result.centerName,
        ]
          .join(" ")
          .toLowerCase();

        return haystack.includes(normalizedSearch);
      })
      .map((result) => ({
        ...result,
        distanceKm: userLocation ? calculateDistanceKm(userLocation, result.centerGeolocation) : null,
      }))
      .sort((a, b) => {
        if (a.distanceKm !== null && b.distanceKm !== null) {
          return a.distanceKm - b.distanceKm;
        }

        if (a.distanceKm !== null) {
          return -1;
        }

        if (b.distanceKm !== null) {
          return 1;
        }

        return a.modelName.localeCompare(b.modelName) || a.centerCity.localeCompare(b.centerCity);
      });
  }, [allFinderResults, searchTerm, selectedMakeSlug, selectedModelSlug, selectedNeedSlug, selectedYear, userLocation, vehicleType]);

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card tone="surface" className="space-y-5">
          <div className="grid grid-cols-3 gap-2 rounded-xl border border-[rgba(30,42,35,0.12)] bg-[var(--off-white)] p-2">
            {modeOptions.map(({ value, label, Icon }) => {
              const isActive = mode === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    if (value !== "vehicle") {
                      setIsComingSoonOpen(true);
                      return;
                    }
                    setMode(value);
                  }}
                  className={cn(
                    "grid min-h-[7rem] grid-rows-[1.75rem_auto] items-start justify-items-center rounded-xl border px-1 py-3 text-center text-[8px] font-semibold uppercase tracking-[0.01em] transition sm:min-h-[6.75rem] sm:px-2.5 sm:text-[11px] sm:tracking-[0.06em]",
                    isActive
                      ? "border-[rgba(12,107,52,0.42)] bg-white text-[var(--castrol-green-deep)]"
                      : "border-transparent text-[var(--muted-foreground)] hover:border-[rgba(30,42,35,0.12)]",
                  )}
                >
                  <span className="flex h-7 items-center justify-center leading-none">
                    <Icon className="h-6 w-6 sm:h-5 sm:w-5" />
                  </span>
                  <span className="block leading-[1.12] [text-wrap:balance]">{label}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-3">
            <p className="text-sm font-semibold text-[var(--foreground)]">Type to search or select from the fields below</p>
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted-foreground)]" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search by brand, model, service, or product"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--muted-foreground)]">
            <span className="h-px flex-1 bg-[rgba(30,42,35,0.2)]" />
            <span>OR</span>
            <span className="h-px flex-1 bg-[rgba(30,42,35,0.2)]" />
          </div>

          <div className="grid gap-3">
            <Select
              value={vehicleType}
              onChange={(event) => {
                setVehicleType(event.target.value as FinderVehicleType);
                setMakeSlug("");
                setModelSlug("");
                setYear("");
                setNeedSlug("");
              }}
            >
              {vehicleTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>

            <Select
              value={selectedMakeSlug}
              onChange={(event) => {
                setMakeSlug(event.target.value);
                setModelSlug("");
                setYear("");
              }}
            >
              <option value="">Make</option>
              {availableMakes.map((make) => (
                <option key={make.slug} value={make.slug}>
                  {make.name}
                </option>
              ))}
            </Select>

            <Select
              value={selectedModelSlug}
              onChange={(event) => {
                setModelSlug(event.target.value);
                setYear("");
              }}
              disabled={!availableModels.length}
            >
              <option value="">Model</option>
              {availableModels.map((model) => (
                <option key={model.slug} value={model.slug}>
                  {model.name} ({model.yearRange})
                </option>
              ))}
            </Select>

            <Select value={selectedYear} onChange={(event) => setYear(event.target.value)} disabled={!availableYears.length}>
              <option value="">Year</option>
              {availableYears.map((optionYear) => (
                <option key={optionYear} value={String(optionYear)}>
                  {optionYear}
                </option>
              ))}
            </Select>

            <Select value={selectedNeedSlug} onChange={(event) => setNeedSlug(event.target.value)}>
              <option value="">Service intent</option>
              {availableNeeds.map((need) => (
                <option key={need.slug} value={need.slug}>
                  {need.name}
                </option>
              ))}
            </Select>
          </div>

          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              trackEvent({
                name: "finder_started",
                payload: {
                  mode,
                  vehicleType,
                  makeSlug: selectedMakeSlug || "all",
                  modelSlug: selectedModelSlug || "all",
                  year: selectedYear || "all",
                  needSlug: selectedNeedSlug || "all",
                  query: searchTerm || "none",
                },
              });
            }}
          >
            Search
          </Button>

          <div className="space-y-3 rounded-[1.25rem] border border-[rgba(30,42,35,0.12)] bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm leading-6 text-[var(--muted-foreground)]">{locationMessage}</p>
              <Button
                type="button"
                variant="secondary"
                className="px-3 py-2 text-xs"
                onClick={() => {
                  if (!navigator.geolocation) {
                    setLocationMessage("Your browser does not support geolocation.");
                    return;
                  }

                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      });
                      setLocationMessage("Nearest service centers and approved affiliates are now shown first.");
                    },
                    () => setLocationMessage("We could not access your location, so results remain unsorted by distance."),
                  );
                }}
              >
                <LocateFixed className="mr-2 h-4 w-4" />
                Near me
              </Button>
            </div>
          </div>
        </Card>

        <Card tone="panel" className="space-y-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">{filteredResults.length} service option(s) found.</p>
          <div className="max-h-[38rem] overflow-y-auto rounded-xl border border-[rgba(30,42,35,0.14)] bg-white">
            {filteredResults.length ? (
              filteredResults.map((result) => (
                <article key={result.id} className="border-b border-[rgba(30,42,35,0.1)] p-4 last:border-b-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <h4 className="text-base font-semibold text-[var(--foreground)]">
                        {result.makeName} {result.modelName} ({result.yearRangeLabel})
                      </h4>
                      <p className="text-sm text-[var(--muted-foreground)]">{result.serviceName}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{result.centerName}</p>
                      <p className="text-sm text-[var(--muted-foreground)]">{result.centerAddress}</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <span className="block rounded-md border border-[rgba(30,42,35,0.16)] bg-[var(--off-white)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--muted-foreground)]">
                        {result.centerSource === "affiliate" ? "Affiliate" : result.centerCity}
                      </span>
                      {result.distanceKm !== null ? (
                        <span className="block text-xs font-semibold uppercase tracking-[0.12em] text-[var(--castrol-red)]">
                          {result.distanceKm.toFixed(1)} km away
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--castrol-red)]">
                    Recommended product: {result.productName}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <LinkButton href={`/booking?product=${result.productSlug}`} className="px-3 py-2 text-xs !text-white">
                      Book service
                    </LinkButton>
                    <LinkButton href={`/products/${result.productSlug}`} variant="secondary" className="px-3 py-2 text-xs">
                      View product <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </LinkButton>
                  </div>
                </article>
              ))
            ) : (
              <div className="p-6 text-sm leading-7 text-[var(--muted-foreground)]">
                No matching services found for this filter combination. Try clearing one or more filters.
              </div>
            )}
          </div>
        </Card>
      </div>

      <ComingSoonDialog
        open={isComingSoonOpen}
        close={() => setIsComingSoonOpen(false)}
        title="Finder mode"
        description="License plate and direct fluid search modes are planned next. Vehicle and equipment mode is active now."
      />
    </>
  );
}

function buildFinderResults(products: Product[], serviceCenters: ServiceCenter[]) {
  const makeBySlug = new Map(vehicleMakes.map((make) => [make.slug, make]));
  const needBySlug = new Map(vehicleNeeds.map((need) => [need.slug, need]));
  const results: FinderResult[] = [];

  for (const model of vehicleModels) {
    const make = makeBySlug.get(model.makeSlug);
    const modelVehicleType = getModelVehicleType(model.slug);
    const yearRange = parseYearRange(model.yearRange);
    const needSlugs = vehicleTypeNeedMap[modelVehicleType];

    for (const nextNeedSlug of needSlugs) {
      const need = needBySlug.get(nextNeedSlug);
      if (!need) {
        continue;
      }

      const neededFamilies = needToFamilySlugs[nextNeedSlug] ?? [];
      const serviceSlug = needToServiceSlug[nextNeedSlug];
      const familyProducts = products.filter((product) => neededFamilies.includes(product.familySlug));

      for (const center of serviceCenters) {
        const centerService =
          center.services.find((service) => service.slug === serviceSlug) ??
          center.services.find((service) => service.slug === "oil-change") ??
          center.services[0];

        const centerFamilySet = new Set(center.inventory.map((inventoryEntry) => inventoryEntry.familySlug));
        const hasFamilyMatch = neededFamilies.some((familySlug) => centerFamilySet.has(familySlug));

        if (!centerService || !hasFamilyMatch) {
          continue;
        }

        const centerProduct =
          familyProducts.find((product) => centerFamilySet.has(product.familySlug)) ?? familyProducts[0];

        if (!centerProduct) {
          continue;
        }

        results.push({
          id: `${model.slug}-${nextNeedSlug}-${center.slug}-${centerService.slug}`,
          vehicleType: modelVehicleType,
          makeSlug: model.makeSlug,
          makeName: make?.name ?? model.makeSlug,
          modelSlug: model.slug,
          modelName: model.name,
          yearRangeLabel: model.yearRange,
          years: yearRange,
          needSlug: nextNeedSlug,
          needName: need.name,
          centerSlug: center.slug,
          centerName: center.name,
          centerCity: center.city,
          centerAddress: center.address,
          centerSource: center.source,
          centerGeolocation: center.geolocation,
          serviceName: centerService.name,
          productSlug: centerProduct.slug,
          productName: centerProduct.name,
        });
      }
    }
  }

  return results;
}

function getModelVehicleType(modelSlug: string): FinderVehicleType {
  return modelVehicleTypeMap[modelSlug] ?? "cars-light-duty-trucks";
}

function parseYearRange(range: string) {
  const [startText, endText] = range.split("-").map((part) => part.trim());
  const startYear = Number.parseInt(startText, 10);
  const endYearCandidate = Number.parseInt(endText, 10);

  if (!Number.isFinite(startYear)) {
    return [];
  }

  const endYear = Number.isFinite(endYearCandidate) ? endYearCandidate : new Date().getFullYear();
  const normalizedEnd = Math.max(startYear, endYear);
  const years: number[] = [];

  for (let year = startYear; year <= normalizedEnd; year += 1) {
    years.push(year);
  }

  return years;
}

function calculateDistanceKm(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
) {
  const earthRadiusKm = 6371;
  const dLat = toRadians(to.lat - from.lat);
  const dLng = toRadians(to.lng - from.lng);
  const lat1 = toRadians(from.lat);
  const lat2 = toRadians(to.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);

  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}
