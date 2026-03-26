import type {
  BlogPost,
  CampaignLandingPage,
  LegalPage,
  Product,
  ProductCategory,
  ProductFamily,
  ProductSegment,
  ServiceCenter,
  VehicleMake,
  VehicleModel,
  VehicleNeed,
} from "@/types/domain";
import catalogueProductsData from "@/lib/data/catalogue-products.json";

export const productCategories: ProductCategory[] = [
  {
    id: "cat-engine",
    slug: "engine-oils",
    name: "Engine Oils",
    description: "Premium passenger-car lubricants for daily driving, performance applications, and workshop upgrade paths.",
    segment: "passenger",
  },
  {
    id: "cat-ev",
    slug: "ev-and-hybrid-fluids",
    name: "EV & Hybrid Fluids",
    description: "Future-ready service products for electrified drivetrains and hybrid maintenance.",
    segment: "ev",
  },
  {
    id: "cat-commercial",
    slug: "commercial-and-driveline",
    name: "Commercial & Driveline",
    description: "Heavy-duty engine, transmission, and axle solutions for fleets, depots, and workshop partners.",
    segment: "commercial",
  },
];

export const productFamilies: ProductFamily[] = [
  { id: "fam-edge", slug: "edge", categorySlug: "engine-oils", name: "EDGE", eyebrow: "Performance line", description: "Flagship synthetic oil family for premium protection.", highlight: "OE-aligned, high-performance passenger vehicle range." },
  { id: "fam-magnatec", slug: "magnatec", categorySlug: "engine-oils", name: "MAGNATEC", eyebrow: "Urban protection", description: "Built for stop-start stress and everyday mixed driving.", highlight: "A natural hero for daily-driver recommendations." },
  { id: "fam-gtx", slug: "gtx", categorySlug: "engine-oils", name: "GTX", eyebrow: "Reliable maintenance", description: "Broad-coverage range for routine service and accessible upgrades.", highlight: "Great catalogue anchor for workshop and ecommerce entry." },
  { id: "fam-magnatec-hybrid", slug: "magnatec-hybrid", categorySlug: "ev-and-hybrid-fluids", name: "MAGNATEC Hybrid", eyebrow: "Hybrid-ready", description: "Hybrid-focused oils built for repeated start-stop cycles.", highlight: "Supports a specialist hybrid-service proposition." },
  { id: "fam-castrol-on", slug: "castrol-on", categorySlug: "ev-and-hybrid-fluids", name: "Castrol ON", eyebrow: "Electrified mobility", description: "EV transmission and future electrified thermal-fluid story.", highlight: "Future-facing platform for EV service journeys." },
  { id: "fam-vecton", slug: "vecton", categorySlug: "commercial-and-driveline", name: "Vecton", eyebrow: "Fleet performance", description: "Heavy-duty diesel protection built around uptime and drain intervals.", highlight: "Commercial flagship for transport and logistics operators." },
  { id: "fam-crb", slug: "crb", categorySlug: "commercial-and-driveline", name: "CRB", eyebrow: "Commercial reliability", description: "Versatile commercial engine-oil platform for broader fleet demand.", highlight: "Cost-conscious heavy-duty service line." },
  { id: "fam-transmax", slug: "transmax", categorySlug: "commercial-and-driveline", name: "Transmax", eyebrow: "Transmission care", description: "Driveline and ATF family for gearbox, axle, and transmission service.", highlight: "Strong bridge between finder, booking, and cart upsell." },
];

const familySheetMap: Record<
  string,
  {
    familySlug: string;
    categorySlug: Product["categorySlug"];
    segment: ProductSegment;
  }
> = {
  EDGE: { familySlug: "edge", categorySlug: "engine-oils", segment: "passenger" },
  MAGNATEC: { familySlug: "magnatec", categorySlug: "engine-oils", segment: "passenger" },
  GTX: { familySlug: "gtx", categorySlug: "engine-oils", segment: "passenger" },
  "MAGNATEC HYBRID": { familySlug: "magnatec-hybrid", categorySlug: "ev-and-hybrid-fluids", segment: "ev" },
  "CASTROL ON": { familySlug: "castrol-on", categorySlug: "ev-and-hybrid-fluids", segment: "ev" },
  VECTON: { familySlug: "vecton", categorySlug: "commercial-and-driveline", segment: "commercial" },
  CRB: { familySlug: "crb", categorySlug: "commercial-and-driveline", segment: "commercial" },
  TRANSMAX: { familySlug: "transmax", categorySlug: "commercial-and-driveline", segment: "driveline" },
};

const featuredProductSlugs = new Set([
  "edge-5w-30-ll",
  "magnatec-5w-30-dx",
  "gtx-5w-40-a3-b4",
  "magnatec-hybrid-0w-20",
  "castrol-on-ev-transmission-fluid-d2",
  "vecton-10w-40-e4-e7",
  "crb-cng-15w-40-la",
  "transmax-atf-dexron-vi-mercon-lv-multivehicle",
]);

const productSlugOverrides: Record<string, string> = {
  "on ev transmission fluid d2": "castrol-on-ev-transmission-fluid-d2",
  "magnatec hybrid 0w-20": "magnatec-hybrid-0w-20",
  "magnatec 5w-30 dx": "magnatec-5w-30-dx",
  "edge 5w-30 ll": "edge-5w-30-ll",
  "gtx 5w-40 a3/b4": "gtx-5w-40-a3-b4",
  "vecton 10w-40 e4/e7": "vecton-10w-40-e4-e7",
  "crb cng 15w-40 la": "crb-cng-15w-40-la",
  "transmax atf dexron-vi mercon lv multivehicle": "transmax-atf-dexron-vi-mercon-lv-multivehicle",
};

const segmentApplicationsMap: Record<ProductSegment, string[]> = {
  passenger: ["Passenger car maintenance", "Routine oil-change operations"],
  commercial: ["Fleet maintenance", "Heavy-duty workshop service"],
  driveline: ["Transmission service operations", "Driveline fluid maintenance"],
  ev: ["Hybrid and EV service pathways", "Electrified driveline maintenance"],
};

type CatalogueRecord = {
  workbook: string;
  sheet: string;
  product: string;
  packs: string[];
  specs: string[];
};

const catalogueRecords = (catalogueProductsData.products as CatalogueRecord[]).filter((record) =>
  Boolean(familySheetMap[normalizeFamilyKey(record.sheet)]),
);

export const products: Product[] = buildProductsFromCatalogue(catalogueRecords);

function buildProductsFromCatalogue(records: CatalogueRecord[]): Product[] {
  const productMap = new Map<string, Product>();

  for (const record of records) {
    const key = normalizeFamilyKey(record.sheet);
    const familyConfig = familySheetMap[key];

    if (!familyConfig) {
      continue;
    }

    const productName = normalizeProductName(record.product, familyConfig.familySlug);
    const normalizedNameKey = productName.toLowerCase().replace(/\s+/g, " ").trim();
    const slug = productSlugOverrides[normalizedNameKey] ?? slugify(productName);
    const tags = record.specs.slice(0, 3);

    const packSizes = record.packs.map((packLabel) => {
      const volumeLiters = Number.parseInt(packLabel.replace(/[^0-9]/g, ""), 10);
      const inventoryStatus =
        Number.isFinite(volumeLiters) && volumeLiters >= 200 ? "limited" : "in-stock";

      return {
        id: `${slug}-${packLabel.toLowerCase()}`,
        label: packLabel,
        volumeLiters: Number.isFinite(volumeLiters) ? volumeLiters : 1,
        sku: `${familyConfig.familySlug.toUpperCase()}-${slugify(packLabel).toUpperCase()}`,
        priceLabel: Number.isFinite(volumeLiters) && volumeLiters >= 16 ? "Workshop quote" : "Request quote",
        inventoryStatus,
      } as const;
    });

    const product: Product = {
      id: `prod-${slug}`,
      slug,
      familySlug: familyConfig.familySlug,
      categorySlug: familyConfig.categorySlug,
      name: productName,
      headline: `${record.sheet} catalogue product for ${segmentLabel(familyConfig.segment)} service and maintenance.`,
      description: `Imported from ${record.workbook} / ${record.sheet} worksheet to keep the live catalogue aligned with source files.`,
      segment: familyConfig.segment,
      featured: featuredProductSlugs.has(slug),
      applications: segmentApplicationsMap[familyConfig.segment],
      tags,
      packSizes,
      specs: record.specs.map((value, index) => ({
        label: `Spec ${index + 1}`,
        value,
      })),
    };

    productMap.set(slug, product);
  }

  return Array.from(productMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}

function normalizeFamilyKey(value: string) {
  return value.trim().toUpperCase();
}

function normalizeProductName(value: string, familySlug: string) {
  if (familySlug === "castrol-on" && !value.toUpperCase().startsWith("CASTROL ON")) {
    return `Castrol ${value}`.replace(/\s+/g, " ").trim();
  }

  return value.replace(/\s+/g, " ").trim();
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function segmentLabel(segment: ProductSegment) {
  const labels: Record<ProductSegment, string> = {
    passenger: "passenger",
    commercial: "commercial",
    driveline: "driveline",
    ev: "hybrid and EV",
  };

  return labels[segment];
}

export const vehicleMakes: VehicleMake[] = [
  { id: "make-audi", slug: "audi", name: "Audi" },
  { id: "make-byd", slug: "byd", name: "BYD" },
  { id: "make-toyota", slug: "toyota", name: "Toyota" },
  { id: "make-bmw", slug: "bmw", name: "BMW" },
  { id: "make-ford", slug: "ford", name: "Ford" },
  { id: "make-mercedes", slug: "mercedes-benz", name: "Mercedes-Benz" },
  { id: "make-volkswagen", slug: "volkswagen", name: "Volkswagen" },
];

export const vehicleModels: VehicleModel[] = [
  { id: "model-audi-q5", makeSlug: "audi", slug: "q5", name: "Q5", yearRange: "2020-2026" },
  { id: "model-byd-atto-3", makeSlug: "byd", slug: "atto-3", name: "ATTO 3", yearRange: "2022-2026" },
  { id: "model-corolla", makeSlug: "toyota", slug: "corolla", name: "Corolla", yearRange: "2019-2026" },
  { id: "model-rav4-hybrid", makeSlug: "toyota", slug: "rav4-hybrid", name: "RAV4 Hybrid", yearRange: "2019-2026" },
  { id: "model-x5", makeSlug: "bmw", slug: "x5", name: "X5", yearRange: "2019-2026" },
  { id: "model-bronco", makeSlug: "ford", slug: "bronco", name: "Bronco", yearRange: "2021-2026" },
  { id: "model-focus", makeSlug: "ford", slug: "focus", name: "Focus", yearRange: "2018-2026" },
  { id: "model-actros", makeSlug: "mercedes-benz", slug: "actros", name: "Actros", yearRange: "2019-2026" },
  { id: "model-id4", makeSlug: "volkswagen", slug: "id-4", name: "ID.4", yearRange: "2021-2026" },
  { id: "model-golf", makeSlug: "volkswagen", slug: "golf", name: "Golf", yearRange: "2018-2026" },
];

export const vehicleNeeds: VehicleNeed[] = [
  { id: "need-engine", slug: "engine-oil-change", name: "Engine Oil Change", description: "Find the right engine oil and related service." },
  { id: "need-transmission", slug: "transmission-service", name: "Transmission Service", description: "Find suitable transmission fluids and branch-ready service options." },
  { id: "need-hybrid", slug: "hybrid-maintenance", name: "Hybrid Maintenance", description: "Hybrid-focused engine oil and EV-aligned service recommendations." },
  { id: "need-fleet", slug: "fleet-heavy-duty", name: "Fleet Heavy Duty Service", description: "Commercial branch for fleets, depots, and heavy-duty operations." },
];

export const serviceCenters: ServiceCenter[] = [
  {
    id: "sc-tbilisi",
    slug: "tbilisi-central",
    name: "Castrol Service Tbilisi Central",
    city: "Tbilisi",
    district: "Didube",
    address: "Aghmashenebeli Alley, Tbilisi",
    geolocation: { lat: 41.7502, lng: 44.7791 },
    openingHours: "Mon-Sat 09:00-19:00",
    phone: "+995 599 00 10 10",
    trustBadges: ["OEM-grade handling", "Booking priority", "Fleet-ready"],
    services: [
      { id: "svc-oil", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-gear", slug: "gearbox-service", name: "Transmission Service", durationMinutes: 75 },
      { id: "svc-check", slug: "diagnostic-check", name: "Fluid & Maintenance Check", durationMinutes: 30 },
    ],
    inventory: [
      { familySlug: "edge", status: "in-stock" },
      { familySlug: "magnatec", status: "in-stock" },
      { familySlug: "transmax", status: "in-stock" },
      { familySlug: "castrol-on", status: "special-order" },
    ],
  },
  {
    id: "sc-kutaisi",
    slug: "kutaisi-west",
    name: "Castrol Service Kutaisi West",
    city: "Kutaisi",
    district: "Auto Corridor",
    address: "Avtomshenebeli Street, Kutaisi",
    geolocation: { lat: 42.2502, lng: 42.6997 },
    openingHours: "Mon-Sat 09:00-18:00",
    phone: "+995 599 00 20 20",
    trustBadges: ["Regional coverage", "Fast-lane service"],
    services: [
      { id: "svc-oil-k", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-check-k", slug: "diagnostic-check", name: "Fluid & Maintenance Check", durationMinutes: 30 },
    ],
    inventory: [
      { familySlug: "magnatec", status: "in-stock" },
      { familySlug: "gtx", status: "in-stock" },
      { familySlug: "transmax", status: "limited" },
    ],
  },
  {
    id: "sc-batumi",
    slug: "batumi-coastal",
    name: "Castrol Service Batumi Coastal",
    city: "Batumi",
    district: "Airport Zone",
    address: "Airport Highway, Batumi",
    geolocation: { lat: 41.6134, lng: 41.6004 },
    openingHours: "Mon-Sun 10:00-19:00",
    phone: "+995 599 00 30 30",
    trustBadges: ["Weekend booking", "Tourist corridor support"],
    services: [
      { id: "svc-oil-b", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
      { id: "svc-hybrid-b", slug: "hybrid-service", name: "Hybrid Maintenance", durationMinutes: 60 },
    ],
    inventory: [
      { familySlug: "edge", status: "limited" },
      { familySlug: "magnatec-hybrid", status: "in-stock" },
      { familySlug: "castrol-on", status: "special-order" },
    ],
  },
  {
    id: "sc-marneuli",
    slug: "marneuli-fleet",
    name: "Castrol Service Marneuli Fleet Point",
    city: "Marneuli",
    district: "Logistics Belt",
    address: "Rustavi Road, Marneuli",
    geolocation: { lat: 41.4787, lng: 44.8085 },
    openingHours: "Mon-Sat 08:30-18:30",
    phone: "+995 599 00 40 40",
    trustBadges: ["Heavy-duty support", "Bulk-pack handling"],
    services: [
      { id: "svc-fleet-m", slug: "fleet-service", name: "Fleet Service", durationMinutes: 90 },
      { id: "svc-oil-m", slug: "oil-change", name: "Oil Change", durationMinutes: 45 },
    ],
    inventory: [
      { familySlug: "vecton", status: "in-stock" },
      { familySlug: "crb", status: "in-stock" },
      { familySlug: "transmax", status: "limited" },
    ],
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-engine-oil-in-georgia",
    title: "How to Choose Engine Oil for Georgia's Driving Conditions",
    excerpt: "A practical guide to approvals, viscosity, and the product-finder path.",
    category: "Maintenance",
    publishedAt: "2026-03-24",
    readTime: "5 min",
    body: [
      "Choosing the right lubricant starts with approvals and operating conditions, not just the viscosity label.",
      "Traffic-heavy urban routes make stop-start protection and cleaner-running formulations more valuable.",
      "A strong digital product finder should shorten the path from compatibility to booking or purchase.",
    ],
  },
  {
    slug: "fleet-lubrication-playbook",
    title: "Fleet Lubrication Playbook",
    excerpt: "Why heavy-duty customers need branch-aware inventory, booking, and bulk-buying flows.",
    category: "B2B",
    publishedAt: "2026-03-20",
    readTime: "4 min",
    body: [
      "Fleet buyers optimize for uptime, service predictability, and stock certainty.",
      "Commercial product pages need very different trust and CTA patterns from passenger products.",
    ],
  },
];

export const campaignPages: CampaignLandingPage[] = [
  {
    slug: "spring-service-check",
    title: "Spring Service Check",
    summary: "Landing-page template for campaign traffic, booking conversion, and catalogue-led upsell.",
    ctaLabel: "Book Spring Service",
  },
  {
    slug: "fleet-readiness",
    title: "Fleet Readiness Program",
    summary: "Lead-focused landing page for workshops, fleet managers, and commercial lubricants.",
    ctaLabel: "Talk to Fleet Team",
  },
];

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    summary: "How lead, booking, and commerce data should be handled by the platform.",
    sections: [
      { heading: "Data Collection", body: "Booking, contact, and ecommerce flows should only collect operationally necessary information." },
      { heading: "CRM Readiness", body: "Typed event hooks and lead structures are separated from UI so CRM and analytics tooling can be added later." },
    ],
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    summary: "Operational placeholder for bookings, product information, and future transactions.",
    sections: [
      { heading: "Booking", body: "Submitted requests are subject to branch capacity, service availability, and product stock confirmation." },
      { heading: "Pricing", body: "Displayed prices in this build are placeholders until backend commerce pricing is connected." },
    ],
  },
  {
    slug: "cookies",
    title: "Cookie Policy",
    summary: "Analytics and tracking foundations for campaign and conversion attribution.",
    sections: [
      { heading: "Event Tracking", body: "The application is designed for typed Meta, GA4, CRM, order, and lead-level events." },
      { heading: "Consent", body: "Consent management remains a later milestone and is not wired in this first implementation pass." },
    ],
  },
];

export function getFamily(slug: string) {
  return productFamilies.find((family) => family.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByFamily(slug: string) {
  return products.filter((product) => product.familySlug === slug);
}

export function getServiceCenter(slug: string) {
  return serviceCenters.find((center) => center.slug === slug);
}

export function getBlogPost(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getCampaign(slug: string) {
  return campaignPages.find((page) => page.slug === slug);
}

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}
