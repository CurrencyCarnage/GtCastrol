import { products, serviceCenters } from "@/lib/site-data";
import { z } from "zod";

export const bookingSubmissionSchema = z.object({
  fullName: z.string().trim().min(2),
  phone: z.string().trim().min(6),
  centerSlug: z.string().trim().min(1),
  offeringSlug: z.string().trim().min(1),
  preferredProductSlug: z.string().trim().optional(),
  slotId: z.string().trim().min(1),
});

export type BookingSubmission = z.infer<typeof bookingSubmissionSchema>;

export function normalizeOptionalBookingValue(value?: string) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

export function parseBookingSlot(slotId: string) {
  const [dateKey, time] = slotId.split("__");

  return {
    dateKey,
    time: time ?? "",
  };
}

export function formatBookingDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);

  if (![year, month, day].every(Number.isFinite)) {
    return dateKey;
  }

  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function resolveBookingDetails(values: BookingSubmission) {
  const center = serviceCenters.find((entry) => entry.slug === values.centerSlug);
  const globalService = serviceCenters.flatMap((entry) => entry.services).find((service) => service.slug === values.offeringSlug);
  const service = center?.services.find((entry) => entry.slug === values.offeringSlug) ?? globalService;
  const preferredProductSlug = normalizeOptionalBookingValue(values.preferredProductSlug);
  const preferredProduct = preferredProductSlug ? products.find((product) => product.slug === preferredProductSlug) : undefined;
  const slot = parseBookingSlot(values.slotId);

  return {
    centerName: center?.name ?? values.centerSlug,
    centerAddress: center?.address ?? "Not provided",
    centerPhone: center?.phone ?? "Not provided",
    serviceName: service?.name ?? values.offeringSlug,
    preferredProductName: preferredProduct?.name ?? "Not specified",
    slotDateLabel: formatBookingDate(slot.dateKey),
    slotTimeLabel: slot.time || values.slotId,
  };
}
