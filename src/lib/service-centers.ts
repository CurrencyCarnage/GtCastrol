import "server-only";

import { listAffiliateRegistrations } from "@/lib/affiliate-store";
import { serviceCenters as staticServiceCenters } from "@/lib/site-data";
import type { InventoryStatus, ServiceCenter, ServiceOffering } from "@/types/domain";

const affiliateServices: ServiceOffering[] = [
  { id: "affiliate-oil-change", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
  { id: "affiliate-check", slug: "diagnostic-check", name: "Fluid & Maintenance Check", durationMinutes: 30 },
  { id: "affiliate-hybrid", slug: "hybrid-service", name: "Hybrid Maintenance", durationMinutes: 60 },
  { id: "affiliate-fleet", slug: "fleet-service", name: "Fleet Service", durationMinutes: 90 },
  { id: "affiliate-gearbox", slug: "gearbox-service", name: "Transmission Service", durationMinutes: 75 },
];

const affiliateInventory: Array<{ familySlug: string; status: InventoryStatus }> = [
  { familySlug: "edge", status: "in-stock" },
  { familySlug: "magnatec", status: "in-stock" },
  { familySlug: "gtx", status: "in-stock" },
  { familySlug: "magnatec-hybrid", status: "in-stock" },
  { familySlug: "castrol-on", status: "special-order" },
  { familySlug: "vecton", status: "limited" },
  { familySlug: "crb", status: "limited" },
  { familySlug: "transmax", status: "in-stock" },
];

export async function getServiceCenters() {
  const affiliates = await listAffiliateRegistrations();
  const approvedAffiliateCenters = affiliates
    .filter((affiliate) => affiliate.status === "approved")
    .map<ServiceCenter>((affiliate) => ({
      id: `affiliate-${affiliate.id}`,
      slug: `affiliate-${affiliate.id}`,
      name: affiliate.serviceName,
      city: extractCityFromAddress(affiliate.address),
      district: "Affiliate Partner",
      address: affiliate.address,
      geolocation: { lat: affiliate.latitude, lng: affiliate.longitude },
      googlePlaceId: affiliate.googlePlaceId,
      openingHours: "Contact service center for schedule",
      phone: affiliate.phone,
      trustBadges: ["Approved affiliate", "Uses Castrol products", "Map-enabled location"],
      services: affiliateServices,
      inventory: affiliateInventory,
      source: "affiliate",
    }));

  return [
    ...staticServiceCenters.map((center) => ({ ...center, source: "static" as const })),
    ...approvedAffiliateCenters,
  ];
}

function extractCityFromAddress(address: string) {
  const [firstSegment] = address
    .split(",")
    .map((segment) => segment.trim())
    .filter(Boolean);

  return firstSegment || "Affiliate Location";
}
