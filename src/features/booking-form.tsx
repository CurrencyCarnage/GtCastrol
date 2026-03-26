"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { useEffect, useEffectEvent, useRef, useState } from "react";

import { ComingSoonDialog } from "@/components/coming-soon-dialog";
import { Button, Card, Input } from "@/components/ui";
import { bookingSubmissionSchema, type BookingSubmission } from "@/lib/booking";
import { trackEvent } from "@/lib/analytics";
import { products, serviceCenters } from "@/lib/site-data";
import { cn } from "@/lib/utils";

interface BookingOption {
  value: string;
  label: string;
  description?: string;
}

interface BookingSlotDay {
  date: string;
  times: string[];
}

const weekdayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function BookingForm() {
  const [displayMonth, setDisplayMonth] = useState(() => startOfMonth(new Date()));
  const [activeDate, setActiveDate] = useState<string | null>(null);
  const [isReservationDialogOpen, setIsReservationDialogOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<
    | { status: "idle"; message: "" }
    | { status: "success" | "error"; message: string }
  >({ status: "idle", message: "" });

  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BookingSubmission>({
    resolver: zodResolver(bookingSubmissionSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      centerSlug: "",
      offeringSlug: "",
      preferredProductSlug: "",
      slotId: "",
    },
  });

  const centerSlug = useWatch({ control, name: "centerSlug", defaultValue: "" });
  const offeringSlug = useWatch({ control, name: "offeringSlug", defaultValue: "" });
  const fullName = useWatch({ control, name: "fullName", defaultValue: "" });
  const phone = useWatch({ control, name: "phone", defaultValue: "" });
  const selectedSlotId = useWatch({ control, name: "slotId" });
  const selectedCenter = serviceCenters.find((center) => center.slug === centerSlug);

  const { data: slotDays = [] } = useQuery({
    queryKey: ["booking-slots", centerSlug, offeringSlug],
    enabled: Boolean(centerSlug && offeringSlug),
    queryFn: async () => buildMockBookingSlots(centerSlug, offeringSlug),
  });

  const slotMap = new Map(slotDays.map((day) => [day.date, day.times]));
  const calendarDays = buildCalendarDays(displayMonth);
  const activeTimes = activeDate ? slotMap.get(activeDate) ?? [] : [];

  const onSubmit = (values: BookingSubmission) => {
    setSubmissionState({ status: "idle", message: "" });

    trackEvent({
      name: "booking_completed",
      payload: {
        centerSlug: values.centerSlug,
        offeringSlug: values.offeringSlug,
        preferredProductSlug: values.preferredProductSlug,
        slotId: values.slotId,
      },
    });
    setIsReservationDialogOpen(true);
  };

  const centerOptions: BookingOption[] = serviceCenters.map((center) => ({
    value: center.slug,
    label: center.name,
    description: `${center.city} / ${center.district}`,
  }));

  const serviceOptions: BookingOption[] =
    selectedCenter?.services.map((service) => ({
      value: service.slug,
      label: service.name,
      description: `${service.durationMinutes} min`,
    })) ?? [];

  const productOptions: BookingOption[] = products.map((product) => ({
    value: product.slug,
    label: product.name,
    description: product.segment,
  }));

  return (
    <>
      <Card className="space-y-6">
        <div>
          <h3 className="font-sans text-3xl font-extrabold uppercase leading-[0.96] tracking-[0.02em] text-white">
            Direct and product-led booking
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/84">
            This MVP supports both direct booking and future product-led booking. Real availability, CRM sync, and order creation remain intentionally abstracted for the next integration pass.
          </p>
        </div>
        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <FieldLabel label="Full name" required />
          <Input
            placeholder="Full name"
            className={!fullName.trim() ? "!border-[var(--danger)] focus:!border-[var(--danger)] focus:!shadow-[0_0_0_3px_rgba(191,44,57,0.12)]" : undefined}
            {...register("fullName", {
              onChange: () => setSubmissionState({ status: "idle", message: "" }),
            })}
          />
        </div>
        <div className="space-y-2">
          <FieldLabel label="Phone number" required />
          <Input
            inputMode="tel"
            placeholder="Phone number"
            className={!phone.trim() ? "!border-[var(--danger)] focus:!border-[var(--danger)] focus:!shadow-[0_0_0_3px_rgba(191,44,57,0.12)]" : undefined}
            {...register("phone", {
              onChange: () => setSubmissionState({ status: "idle", message: "" }),
            })}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel label="Service location" required />
          <Controller
            control={control}
            name="centerSlug"
            render={({ field }) => (
              <BookingSelectField
                placeholder="Choose service center"
                value={field.value}
                options={centerOptions}
                invalid={!field.value}
                onChange={(nextValue) => {
                  setSubmissionState({ status: "idle", message: "" });
                  field.onChange(nextValue);
                  setValue("offeringSlug", "", { shouldValidate: true });
                  setValue("slotId", "", { shouldValidate: true });
                  setActiveDate(null);
                  setDisplayMonth(startOfMonth(new Date()));
                  trackEvent({ name: "booking_started", payload: { centerSlug: nextValue } });
                }}
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <FieldLabel label="Service" required />
          <Controller
            control={control}
            name="offeringSlug"
            render={({ field }) => (
              <BookingSelectField
                placeholder="Choose service"
                value={field.value}
                options={serviceOptions}
                disabled={!selectedCenter}
                invalid={!field.value}
                emptyLabel="Choose a branch first"
                onChange={(nextValue) => {
                  setSubmissionState({ status: "idle", message: "" });
                  field.onChange(nextValue);
                  setValue("slotId", "", { shouldValidate: true });
                  setActiveDate(null);
                  setDisplayMonth(startOfMonth(new Date()));
                }}
              />
            )}
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <FieldLabel label="Preferred product" />
          <Controller
            control={control}
            name="preferredProductSlug"
            render={({ field }) => (
              <BookingSelectField
                placeholder="Preferred product (optional)"
                value={field.value ?? ""}
                options={productOptions}
                emptyLabel="No products available"
                onChange={(nextValue) => {
                  setSubmissionState({ status: "idle", message: "" });
                  field.onChange(nextValue);
                }}
              />
            )}
          />
        </div>

        <input type="hidden" {...register("slotId")} />

        <div className="space-y-3 md:col-span-2 rounded-[1.6rem] border border-white/12 bg-white/8 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--castrol-yellow)]">Availability calendar</p>
              <p className="text-sm text-white/84">
                {slotDays.length
                  ? "Select a highlighted day to reveal available appointment times."
                  : "Choose a branch and service to preview availability."}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDisplayMonth(shiftMonth(displayMonth, -1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition hover:border-white/26 hover:bg-white/12"
                aria-label="Previous month"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="rounded-full border border-white/14 bg-white/8 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                {formatMonthYear(displayMonth)}
              </div>
              <button
                type="button"
                onClick={() => setDisplayMonth(shiftMonth(displayMonth, 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/14 bg-white/8 text-white transition hover:border-white/26 hover:bg-white/12"
                aria-label="Next month"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-2">
            {weekdayLabels.map((label) => (
              <div
                key={label}
                className="pb-1 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-white/74 sm:text-[11px]"
              >
                {label}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day) => {
              const dateKey = toDateKey(day);
              const availableTimes = slotMap.get(dateKey);
              const isCurrentMonth =
                day.getMonth() === displayMonth.getMonth() && day.getFullYear() === displayMonth.getFullYear();
              const isActive = activeDate === dateKey;

              return (
                <button
                  key={dateKey}
                  type="button"
                  disabled={!availableTimes}
                  onClick={() => {
                    setSubmissionState({ status: "idle", message: "" });
                    setActiveDate(dateKey);
                    setValue("slotId", "", { shouldValidate: true });
                  }}
                  className={cn(
                    "flex min-h-[4.6rem] flex-col items-start justify-between rounded-[1.15rem] border px-2 py-2 text-left transition sm:min-h-[5.2rem] sm:px-3",
                    isCurrentMonth ? "text-white" : "text-white/28",
                    availableTimes
                      ? "border-white/16 bg-white/8 hover:border-white/28 hover:bg-white/12"
                      : "cursor-default border-white/8 bg-black/10",
                    isActive && "border-white/34 bg-white/14 shadow-[0_16px_36px_rgba(255,255,255,0.08)]",
                  )}
                >
                  <span className="text-sm font-semibold sm:text-base">{day.getDate()}</span>
                  {availableTimes ? (
                    <span className="rounded-full border border-white/12 bg-white/8 px-2 py-1 text-[9px] uppercase tracking-[0.12em] text-white/80 sm:text-[10px]">
                      {availableTimes.length} slot{availableTimes.length > 1 ? "s" : ""}
                    </span>
                  ) : (
                    <span className="text-[9px] uppercase tracking-[0.12em] text-white/20 sm:text-[10px]">-</span>
                  )}
                </button>
              );
            })}
          </div>

          {slotDays.length ? (
            activeDate && activeTimes.length ? (
              <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4">
                <div className="space-y-1">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--castrol-yellow)]">Available slots</p>
                  <p className="text-sm font-semibold text-white">{formatSelectedDay(activeDate)}</p>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeTimes.map((time) => {
                    const slotId = `${activeDate}__${time}`;
                    const isSelected = selectedSlotId === slotId;

                    return (
                      <button
                        key={slotId}
                        type="button"
                        onClick={() => {
                          setSubmissionState({ status: "idle", message: "" });
                          setValue("slotId", slotId, { shouldValidate: true, shouldDirty: true });
                        }}
                        className={cn(
                          "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition",
                          isSelected
                            ? "border-[rgba(0,91,42,0.9)] bg-[linear-gradient(180deg,#0aa24b,#007a37)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_10px_24px_rgba(0,122,55,0.18)]"
                            : "border-white/14 bg-white/8 text-white hover:border-white/28 hover:bg-white/12",
                        )}
                      >
                        {isSelected ? <Check className="h-4 w-4" /> : null}
                        {time}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/6 p-4 text-sm text-white/84">
                Pick any highlighted day to view appointment times for that date.
              </div>
            )
          ) : (
            <div className="rounded-[1.4rem] border border-dashed border-white/12 bg-white/6 p-4 text-sm text-white/84">
              Choose a branch and service to preview availability.
            </div>
          )}

          {errors.slotId ? <p className="text-xs text-white/82">Choose an available appointment slot.</p> : null}
        </div>

        <div className="md:col-span-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending request..." : "Reserve service"}
          </Button>
        </div>
        {submissionState.status !== "idle" ? (
          <p
            className={cn(
              "md:col-span-2 rounded-[1rem] border px-4 py-3 text-sm",
              submissionState.status === "success"
                ? "border-white/14 bg-white/10 text-white"
                : "border-[rgba(191,44,57,0.28)] bg-[rgba(191,44,57,0.12)] text-[var(--accent)]",
            )}
          >
            {submissionState.message}
          </p>
        ) : null}
        </form>
      </Card>
      <ComingSoonDialog
        open={isReservationDialogOpen}
        close={() => setIsReservationDialogOpen(false)}
        eyebrow="Reservation"
        title="The Reservation Booked"
        description="The Reservation Booked"
        actionLabel="Close"
      />
    </>
  );
}

function BookingSelectField({
  placeholder,
  value,
  onChange,
  options,
  disabled = false,
  invalid = false,
  emptyLabel = "No options available",
}: {
  placeholder: string;
  value: string;
  onChange: (nextValue: string) => void;
  options: BookingOption[];
  disabled?: boolean;
  invalid?: boolean;
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
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex min-h-12 w-full items-center justify-between rounded-[1.5rem] border border-white/20 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(240,247,235,0.96))] px-4 py-3 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.5)] transition",
          disabled ? "cursor-not-allowed opacity-45" : "hover:border-white/40 hover:bg-white",
          invalid && "border-[var(--danger)] shadow-[0_0_0_3px_rgba(191,44,57,0.12)]",
          open && "border-white/60 shadow-[0_0_0_3px_rgba(255,255,255,0.14)]",
        )}
      >
        <span className={cn("truncate text-base", selectedOption ? "text-[var(--foreground)]" : "text-[rgba(47,79,58,0.6)]")}>
          {selectedOption?.label ?? placeholder}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-[var(--muted-foreground)] transition", open && "rotate-180")} />
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
                        isSelected
                          ? "bg-[rgba(220,235,216,0.95)] text-[var(--foreground)]"
                          : "text-[var(--foreground)] hover:bg-[rgba(220,235,216,0.72)]",
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

function FieldLabel({
  label,
  required = false,
}: {
  label: string;
  required?: boolean;
}) {
  return (
    <div className="flex items-center gap-2 px-1">
      <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/82">{label}</span>
      <span className="rounded-full border border-white/12 bg-white/8 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/64">
        {required ? "Required" : "Optional"}
      </span>
    </div>
  );
}

function buildMockBookingSlots(centerSlug: string, offeringSlug: string): BookingSlotDay[] {
  const baseOffsets =
    {
      "oil-change": [2, 5, 9, 14, 18, 24, 31],
      "gearbox-service": [3, 8, 12, 19, 26, 34],
      "diagnostic-check": [1, 4, 7, 11, 16, 22, 29],
      "hybrid-service": [6, 13, 20, 27, 35],
      "fleet-service": [4, 10, 17, 25, 33],
    }[offeringSlug] ?? [2, 6, 12, 20, 28];

  const centerShift =
    {
      "tbilisi-central": 0,
      "kutaisi-west": 1,
      "batumi-coastal": 2,
      "marneuli-fleet": 3,
    }[centerSlug] ?? 0;

  const timePatterns = [
    ["09:30", "11:00", "13:30"],
    ["10:00", "12:30"],
    ["11:30", "15:00"],
    ["09:00", "14:30", "17:00"],
  ];

  const today = new Date();

  return baseOffsets.map((offset, index) => {
    const date = new Date(today.getFullYear(), today.getMonth(), today.getDate() + offset + centerShift);
    const times = timePatterns[(index + centerShift) % timePatterns.length];

    return {
      date: toDateKey(date),
      times,
    };
  });
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function shiftMonth(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function buildCalendarDays(month: Date) {
  const firstDayOfMonth = startOfMonth(month);
  const dayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const calendarStart = new Date(firstDayOfMonth);

  calendarStart.setDate(firstDayOfMonth.getDate() - dayOffset);

  return Array.from({ length: 42 }, (_, index) => {
    const day = new Date(calendarStart);

    day.setDate(calendarStart.getDate() + index);
    return day;
  });
}

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatMonthYear(date: Date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

function formatSelectedDay(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
