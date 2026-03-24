"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { Button, Card, Input, Select } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { products, serviceCenters } from "@/lib/site-data";

const bookingSchema = z.object({
  fullName: z.string().min(2),
  phone: z.string().min(6),
  centerSlug: z.string().min(1),
  offeringSlug: z.string().min(1),
  preferredProductSlug: z.string().optional(),
});

type BookingValues = z.infer<typeof bookingSchema>;

export function BookingForm() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitSuccessful },
  } = useForm<BookingValues>({ resolver: zodResolver(bookingSchema) });

  const centerSlug = useWatch({ control, name: "centerSlug" });
  const offeringSlug = useWatch({ control, name: "offeringSlug" });
  const selectedCenter = serviceCenters.find((center) => center.slug === centerSlug);

  const { data: slots } = useQuery({
    queryKey: ["booking-slots", centerSlug, offeringSlug],
    enabled: Boolean(centerSlug && offeringSlug),
    queryFn: async () => ["Tomorrow / 10:00", "Tomorrow / 12:30", "Friday / 15:00"],
  });

  const onSubmit = (values: BookingValues) => {
    trackEvent({
      name: "booking_completed",
      payload: {
        centerSlug: values.centerSlug,
        offeringSlug: values.offeringSlug,
        preferredProductSlug: values.preferredProductSlug,
      },
    });
  };

  return (
    <Card className="space-y-6">
      <div>
        <h3 className="font-display text-2xl uppercase tracking-[0.08em] text-white">
          Direct and product-led booking
        </h3>
        <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
          This MVP supports both direct booking and future product-led booking. Real availability, CRM sync, and order creation remain intentionally abstracted for the next integration pass.
        </p>
      </div>
      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-2">
          <Input placeholder="Full name" {...register("fullName")} />
          {errors.fullName ? <p className="text-xs text-[var(--danger)]">Enter your name.</p> : null}
        </div>
        <div className="space-y-2">
          <Input placeholder="Phone number" {...register("phone")} />
          {errors.phone ? <p className="text-xs text-[var(--danger)]">Enter a valid phone number.</p> : null}
        </div>
        <div className="space-y-2">
          <Select
            defaultValue=""
            {...register("centerSlug")}
            onChange={(event) => {
              register("centerSlug").onChange(event);
              trackEvent({ name: "booking_started", payload: { centerSlug: event.target.value } });
            }}
          >
            <option value="">Choose service center</option>
            {serviceCenters.map((center) => (
              <option key={center.slug} value={center.slug}>
                {center.name}
              </option>
            ))}
          </Select>
          {errors.centerSlug ? <p className="text-xs text-[var(--danger)]">Choose a branch.</p> : null}
        </div>
        <div className="space-y-2">
          <Select defaultValue="" {...register("offeringSlug")} disabled={!selectedCenter}>
            <option value="">Choose service</option>
            {selectedCenter?.services.map((service) => (
              <option key={service.slug} value={service.slug}>
                {service.name}
              </option>
            ))}
          </Select>
          {errors.offeringSlug ? <p className="text-xs text-[var(--danger)]">Choose a service.</p> : null}
        </div>
        <div className="md:col-span-2">
          <Select defaultValue="" {...register("preferredProductSlug")}>
            <option value="">Preferred product (optional)</option>
            {products.map((product) => (
              <option key={product.slug} value={product.slug}>
                {product.name}
              </option>
            ))}
          </Select>
        </div>
        <div className="md:col-span-2 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-[var(--muted-foreground)]">
          {slots?.length ? (
            <>
              <p className="font-semibold text-white">Next available slots</p>
              <ul className="mt-2 space-y-1">
                {slots.map((slot) => (
                  <li key={slot}>{slot}</li>
                ))}
              </ul>
            </>
          ) : (
            "Choose a branch and service to preview availability."
          )}
        </div>
        <div className="md:col-span-2">
          <Button type="submit">Reserve service</Button>
        </div>
        {isSubmitSuccessful ? (
          <p className="md:col-span-2 text-sm text-[var(--accent)]">
            Booking request captured. The current build stops at the UI and typed event layer.
          </p>
        ) : null}
      </form>
    </Card>
  );
}
